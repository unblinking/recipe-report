#!/usr/bin/env node

"use strict";

/**
 * Define application end points (routes) for the Grocereport API and how they respond to client requests.
 * @namespace routes
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var passportJWT = require("passport-jwt");
var jwt = require("jsonwebtoken");
var Isemail = require("isemail");
var sendmail = require("sendmail")({
    silent: true
});

var account = require("../models/account");

// Setup passport
passport.use(new LocalStrategy(account.authenticate()));
passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());
var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.JWT_SECRET || "testSecret";
jwtOptions.algorithm = process.env.JWT_ALGORITHM || "HS256";
passport.use(new JwtStrategy(
    jwtOptions,
    function (payload, done) {
        // console.log(payload);
        account.findOne(payload._id, function (err, account) {
            if (err) {
                return done(err, false);
            }
            if (account) {
                done(null, account);
            } else {
                done(null, false);
            }
        });
    }));

/**
 * @public
 * @namespace router
 * @memberof routes
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html Express API}
 */
var router = function (app) {

    /**
     * GET request to the root route. Responds with status 200 and JSend-compliant response.
     * @public
     * @function
     * @memberof! routes.router
     * @example
     * var request = require("request");
     * request("http://api.grocereport.com/",
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     */
    app
        .get("/", function (req, res) {
            res
                .status(200)
                .json({
                    "status": "success",
                    "data": {
                        "headers": req.headers
                    }
                });
        });

    /**
     * POST request to the register route. Register a new account document using the username and password provided. Responds with a JSend-compliant response.
     * @public
     * @function
     * @memberof! routes.router
     * @example
     * var request = require("request");
     * var options = {
     *     url: "http://api.grocereport.com/register",
     *     json: {
     *         "username": "testUsername",
     *         "password": "testPassword"
     *     }
     * };
     * request.post(options, function(err, res, body) {
     *     if (!err && res.statusCode == 200) {
     *         console.log(body);
     *     }
     * });
     */
    app.post("/register", function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var headers = req.headers;
        // Verify that the username is an email address.
        if (username !== null) { // Success receiving username
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex looks like a valid email address
            if (regex.test(username)) { // The username appears to be a valid email address
                account
                    .register(new account({
                        email: username
                    }), password, function (err, account) {
                        if (err) { // Error registering the account
                            res
                                .status(200)
                                .json({
                                    "status": "error",
                                    "err": err
                                });
                            return next(err);
                        } else { // Success registering the account
                            // Sign a token that expires in 48 hours
                            jwt
                                .sign({
                                    data: account._doc._id
                                }, jwtOptions.secretOrKey, {
                                    algorithm: jwtOptions.algorithm,
                                    expiresIn: 172800 // Two days, as seconds
                                }, function (err, token) {
                                    if (err) { // Error signing the token
                                        res
                                            .status(200)
                                            .json({
                                                "status": "error",
                                                "err": err
                                            });
                                    } else { // Success signing the token
                                        if (process.env.NODE_ENV == "production") {
                                            // Send an email containing an account activation link
                                            sendmail({
                                                from: "no-reply@grocereport.com",
                                                to: username,
                                                subject: "Welcome",
                                                text: `Hello ${username},\n\nThank you for registering with Grocereport. Please follow this link to activate your new account:\n\nhttps://api.grocereport.com/activate/${token} \n\nYou received this email because you (or someone else) used this email address to create a new account with Grocereport.\n\nRequest headers: ${JSON.stringify(headers, null, '\t')}`,
                                            }, function (err, reply) {
                                                if (err) { // Error sending activation email
                                                    console.log(err && err.stack);
                                                    console.dir(reply);
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "status": "error",
                                                            "err": err
                                                        });
                                                } else { // Success sending the activation email
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "status": "success",
                                                            "message": `Account ${username} registered successfully. Account activation is required before you can login. An activation email has been sent. Please follow the link provided in the activation email.`
                                                        });
                                                }
                                            });
                                        } else { // Not the production environment
                                            res
                                                .status(200)
                                                .json({
                                                    "status": "success",
                                                    "message": `Account ${username} registered successfully. Account activation is required before you can login. An activation email has been sent. Please follow the link provided in the activation email.`,
                                                    "req.headers": headers,
                                                    "email": `Thank you for registering with Grocereport. Please follow this link to activate your new account: http://localhost:1138/activate/${token} ${JSON.stringify(headers)}`
                                                });
                                        }
                                    }
                                });
                        }
                    });
            } else { // Username doesn't appear to be a real email address
                res.status(200).json({
                    "status": "error",
                    "err": `Invalid email ${username}.`
                });
            }
        } else { // Error receiving username
            res.status(200).json({
                "status": "error",
                "err": `No username was given.`
            });
        }
    });

    app.get("/activate/:token", function (req, res) {
        var token = req.params.token;
        if (token !== null) { // Success receiving token
            jwt.verify(token, jwtOptions.secretOrKey, function (err, decoded) {
                if (err) { // Error decoding token
                    return res
                        .status(200)
                        .json({
                            "status": "error",
                            "err": "Failed to authenticate token.",
                            "token": token
                        });
                } else { // Success decoding token
                    console.dir(decoded);
                    return res
                        .status(200)
                        .json({
                            "status": "success",
                            "message": "Account activated successfully. You can now login using your username and password."
                        });
                }
            });
        } else { // Failure receiving token
            return res
                .status(200)
                .json({
                    "status": "error",
                    "err": `No token provided.`
                });
        }
    });

    /**
     * POST request to the login route. Authenticates an account based on the username and password provided. Generates a token with payload containing user._doc._id. Responds with a JSend-compliant response, including the token.
     * @public
     * @function
     * @memberof! routes.router
     * @example
     * var request = require("request");
     * var options = {
     *     url: "http://api.grocereport.com/login",
     *     json: {
     *         "username": "testUsername",
     *         "password": "testPassword"
     *     }
     * };
     * request.post(options, function(err, res, body) {
     *     if (!err && res.statusCode == 200) {
     *         console.log(body);
     *     }
     * });
     */
    app.post("/login", passport.authenticate("local"), function (req, res) {
        // Sign a token that holds the object ID of the user's MongoDB account document.
        jwt
            .sign({
                data: req.user._doc._id
            }, jwtOptions.secretOrKey, {
                algorithm: jwtOptions.algorithm
            }, function (err, token) {
                if (err) {
                    res
                        .status(200)
                        .json({
                            "status": "error",
                            "err": err
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            "status": "success",
                            "message": `User ${req.body.username} successfully authenticated.`,
                            "data": {
                                "token": token
                            }
                        });
                }
            });
    });

    /**
     * All routes below will be checked for a valid authorization token. If no token is present or authentication fails, responds with a JSend-compliant response. If authorization is successful, adds decoded payload data to the request object and then calls next.
     */
    app.use(function (req, res, next) {
        var token = req.headers.authorization;
        if (token) {
            jwt
                .verify(token, jwtOptions.secretOrKey, function (err, decoded) {
                    if (err) {
                        return res
                            .status(200)
                            .json({
                                "status": "error",
                                "err": "Failed to authenticate token."
                            });
                    } else {
                        req.decoded = decoded.data;
                        next();
                    }
                });
        } else {
            return res
                .status(200)
                .json({
                    "status": "error",
                    "err": "No token provided"
                });
        }
    });

    /**
     * GET request to the test route. Responds with a JSend-compliant response
     * @public
     * @function
     * @memberof! routes.router
     * @example
     * var request = require("request");
     * var options = {
     *     url: "http://api.grocereport.com/test",
     *     headers: {
     *         "Authorization": "secret token"
     *     }
     * };
     * request(options,
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     */
    app.get("/test", function (req, res) {
        // req.decoded holds the account document ID
        res
            .status(200)
            .json({
                "status": "success",
                "message": "Welcome to the team, DZ-015"
            });
    });

};

/**
 * Assign our appRouter object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = router;