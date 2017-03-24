#!/usr/bin/env node

/**
 * The application end points (routes) for the Grocereport API server.
 * @namespace routes
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 * @see {@link https://github.com/auth0/node-jsonwebtoken node-jsonwebtoken}
 * @see {@link https://github.com/jaredhanson/passport-local passport-local}
 * @see {@link https://github.com/jaredhanson/passport Passport}
 */
const bluebird = require('bluebird');
const jwt = require("jsonwebtoken");
const localStrategy = require("passport-local").Strategy;
const passport = require("passport");

/**
 * Require the local modules that will be used.
 */
const account = require("../models/account");
const emailActivationLink = bluebird.promisify(require("../util/email").activationLink);
const emailLooksOk = bluebird.promisify(require("../util/email").looksOk);
const findAccount = bluebird.promisify(require("../models/account").findOne);
const registerAccount = bluebird.promisify(require("../util/account").register);
const respond = require("../util/respond");
const signToken = bluebird.promisify(require("../util/jwt").sign);
const verifyToken = bluebird.promisify(require("../util/jwt").verify);

/**
 * Setup Passport.
 */
passport.use(new localStrategy({
  usernameField: "email"
}, account.authenticate()));
passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());

/**
 * @public
 * @namespace router
 * @memberof routes
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html Express API}
 */
const router = function (app) {

  /**
   * GET request to the root route. Responds with a JSend-compliant response.
   * @public
   * @function
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * request("https://api.grocereport.com/",
   *   function(err, res, body) {
   *     if (!err && res.statusCode == 200) {
   *       console.log(body);
   *     }
   *   });
   */
  app.get("/", function (req, res) {
    respond.success(res, "This is the Grocereport API server. http://www.Grocereport.com", {
      headers: req.headers
    });
  });

  /**
   * POST request to the register route. Registers a new account document in the MongoDB instance based on the email address and password provided. Sends an activation email. Responds with a JSend-compliant response.
   * @public
   * @function
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * const options = {
   *   url: "https://api.grocereport.com/register",
   *   json: {
   *     "email": "no-reply@grocereport.com",
   *     "password": "testPassword"
   *   }
   * };
   * request.post(options, function(err, res, body) {
   *   if (!err && res.statusCode == 200) {
   *     console.log(body);
   *   }
   * });
   */
  app.post("/register", function (req, res) {
    emailLooksOk({
        email: req.body.email,
        password: req.body.password,
        headers: req.headers
      })
      .then(registerAccount)
      .then(signToken)
      .then(emailActivationLink)
      .then(function (bundle) {
        respond.success(res, "Registration successful.");
      })
      .catch(function (err) {
        respond.err(res, err.message);
      });
  });

  /**
   * GET request to the activate route. Activates an account based on the token provided. Responds with a JSend-compliant response.
   * @public
   * @function
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * request("https://api.grocereport.com/activate/secret-token",
   *   function (err, response, body) {
   *     if (!err && res.statusCode == 200) {
   *       console.log(body);
   *     }
   *   });
   */
  app.get("/activate/:token", function (req, res) {
    verifyToken({
        token: req.params.token
      })
      .then(function (bundle) {
        // TODO: Actually activate the account.
        console.dir(bundle.decoded);
        respond.success(res, "Activation successful.");
      })
      .catch(function (err) {
        respond.err(res, err.message);
      });
  });

  /**
   * POST request to the login route. Authenticates an account based on the email address and password provided. Generates a token with payload containing user._doc._id. Responds with a JSend-compliant response, including the token.
   * @public
   * @function
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * const options = {
   *   url: "https://api.grocereport.com/login",
   *   json: {
   *     "email": "no-reply@grocereport.com",
   *     "password": "temp"
   *   }
   * };
   * request.post(options, function(err, res, body) {
   *   if (!err && res.statusCode == 200) {
   *     console.log(body);
   *   }
   * });
   */
  app.post("/login", passport.authenticate("local"), function (req, res) {
    signToken({
        account: req.user
      })
      .then(function (bundle) {
        respond.success(res, "Authentication successful.", {
          token: bundle.token
        });
      })
      .catch(function (err) {
        respond.err(res, err.message);
      });
  });

  /**
   * Middleware for token verification. Applies to all routes below. On success, adds decoded payload data to the request object and then calls next. On error, responds with a JSend-compliant response.
   */
  app.use(function (req, res, next) {
    verifyToken({
        token: req.headers.token
      })
      .then(function (bundle) {
        req.decoded = bundle.decoded.data;
        return next();
      })
      .catch(function (err) {
        respond.err(res, err.message);
      });
  });

  /**
   * GET request to the test route. Responds with a JSend-compliant response
   * @public
   * @function
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * const options = {
   *   url: "https://api.grocereport.com/test",
   *   headers: {
   *     token: "secret-token"
   *   }
   * };
   * request(options,
   *   function(err, res, body) {
   *     if (!err && res.statusCode == 200) {
   *       console.log(body);
   *     }
   *   });
   */
  app.get("/test", function (req, res) {
    // This is just here for development and debugging purposes.
    // req.decoded holds the account document ID.
    respond.success(res, "Welcome to the team, DZ-015", req.decoded);
  });

};

/**
 * Assign our appRouter object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = router;