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
var jwt = require('jsonwebtoken');
var account = require("../models/account");
var Isemail = require('isemail');
var sendmail = require('sendmail')({
    silent: true
});

// Setup passport
passport.use(new LocalStrategy(account.authenticate()));
passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());
var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.JWT_SECRET || 'testSecret';
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
        // Verify that the username is an email address.
        Isemail.validate(
            req.body.username, {
                checkDNS: true
            },
            function (result) {
                if (result) { // If the username is an email address...
                    account
                        .register(new account({
                            username: req.body.username
                        }), req.body.password, function (err, account) {
                            if (err) {
                                res
                                    .status(200)
                                    .json({
                                        "status": "error",
                                        "err": err
                                    });
                                return next(err);
                            }

                            // TODO: Send a registration email using node-sendmail
                            // https://github.com/guileen/node-sendmail

                            if (process.env.NODE_ENV == "production") {
                                sendmail({
                                    from: 'no-reply@grocereport.com',
                                    to: req.body.username,
                                    subject: 'Welcome',
                                    html: 'Thank you for registering with Grocereport.',
                                }, function (err, reply) {
                                    console.log(err && err.stack);
                                    console.dir(reply);
                                });
                            }

                            res
                                .status(200)
                                .json({
                                    "status": "success",
                                    "message": `Account ${req.body.username} registered successfully.`
                                });
                        });
                } else { // If the username is not an email address.
                    res.status(200).json({
                        "status": "error",
                        "err": `Invalid email ${req.body.username}.`
                    });
                }
            }
        );
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