#!/usr/bin/env node

/**
 * Define application end points (routes) for the Grocereport API and how they respond to client requests.
 * @namespace routes
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

"use strict";

var jwt = require('jsonwebtoken');
var account = require("../models/account");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var passportJWT = require("passport-jwt");

var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.JWT_SECRET || 'testSecret';
jwtOptions.algorithm = process.env.JWT_ALGORITHM || "HS256";

passport.use(new LocalStrategy(account.authenticate()));
passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());
passport.use(new JwtStrategy(jwtOptions, function(payload, done) {
    console.log(payload);
    account
        .findOne(payload._id, function(err, account) {
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
var router = function(app) {

    /**
     * GET request to the root route. Responds with the JSON object { "message": "hello" }
     * @public
     * @function .app.get("/")
     * @memberof! routes.router
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * // Responds with the JSON object { "message": "hello" }
     * var request = require("request");
     * request("http://www.grocereport.com/",
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app
        .get("/", function(req, res) {
            res
                .status(200)
                .json({ "message": "hello" });
        });

    /**
     * @function app.post
     * @memberof! routes.router
     * @public
     * @summary POST request to the register route. Register an account using the username and password provided when a POST request is made to the register route.
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * var request = require("request");
     * var options = {
     *     url: "http://grocereport.com/register",
     *     json: {
     *         "name": "Joshua",
     *         "password": "Password"
     *     },
     * };
     * request.post(options, function(err, res, body) {
     *     console.log(body);
     * });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.post("/register", function(req, res, next) {
        console.log(`Registering user.`);
        account.register(new account({ username: req.body.username }), req.body.password, function(err, account) {
            if (err) {
                res
                    .status(401)
                    .json({ "status": "error", "message": err });
                return next(err);
            }
            res
                .status(200)
                .json({
                    "status": "success",
                    "message": `User ${req.body.username} registered successfully.`,
                    "data": {
                        "account": account
                    }
                });
        });
    });

    /**
     * @function app.post
     * @memberof! routes.router
     * @public
     * @summary POST request to the login route. Authenticate an account based on the username and password provided when a POST request is made to the login route.
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * var request = require("request");
     * var options = {
     *     url: "http://grocereport.com/login",
     *     json: {
     *         "name": "Joshua",
     *         "password": "Password"
     *     },
     * };
     * request.post(options, function(err, res, body) {
     *     console.log(body);
     * });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.post("/login", passport.authenticate("local"), function(req, res) {
        jwt
            .sign({
                data: req.body.username
            }, jwtOptions.secretOrKey, {
                algorithm: jwtOptions.algorithm
            }, function(err, token) {
                console.log("generated token");
                console.log(token);
                res
                    .status(200)
                    .json({
                        "status": "success",
                        "message": `User ${req.body.username} successfully authenticated.`,
                        "data": {
                            "token": token
                        }
                    });
            });
    });

    /**
     * Adding this middleware here. All routes below here will have to go
     * through this, which checks for a valid token in the request.
     */
    app.use(function(req, res, next) {
        // Look for requests with a token in the header
        var token = req.headers.authorization;
        console.log('break');
        if (token) {
            jwt.verify(token, jwtOptions.secretOrKey, function(err, decoded) {
                console.log('break');
                if (err) {
                    return res.json({
                        "status": "error",
                        "message": "Failed to authenticate token."
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                "status": "error",
                "message": "No token provided"
            });
        }
    });

    /**
     * GET request to the /test route. Responds with the JSON object { "message": "Welcome to the team, DZ-015" }
     * @public
     * @function app.get("/test")
     * @memberof! routes.router
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * // Responds with the JSON object { "message": "Welcome to the team, DZ-015" }
     * var request = require("request");
     * request("http://www.grocereport.com/test",
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.get("/test", function(req, res) {
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