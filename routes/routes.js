#!/usr/bin/env node

'use strict'

/**
 * Application end points (routes).
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/jaredhanson/passport-local passport-local}
 * @see {@link https://github.com/jaredhanson/passport Passport}
 */
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

/**
 * Require the local modules that will be used.
 */
const accountModel = require('../models/account')
const crypt = require('../lib/crypt')
const sendActivationEmail = require('../lib/email').sendActivation
const emailLooksOk = require('../lib/email').looksOk
const registerAccount = require('../lib/account').register
const respond = require('../lib/respond')
const generateToken = require('../lib/jwt').generateToken
const verifyToken = require('../lib/jwt').verifyToken

/**
 * Setup Passport.
 */
passport.use(new LocalStrategy({
  usernameField: 'email'
}, accountModel.authenticate()))
passport.serializeUser(accountModel.serializeUser())
passport.deserializeUser(accountModel.deserializeUser())

/**
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html Express API}
 */
const router = (app) => {
  /**
   * GET request to the root route. Responds with a JSend-compliant response.
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * request("https://api.recipe.report/",
   *   function(err, res, body) {
   *     if (!err && res.statusCode == 200) {
   *       console.log(body);
   *     }
   *   });
   */
  app.get('/', (req, res) =>
    respond.success(res, 'This is the http://www.Recipe.Report API server.', {
      headers: req.headers
    })
  )

  /**
   * POST request to the register route. Registers a new account document in the
   * MongoDB instance based on the email address and password provided. Sends an
   * activation email. Responds with a JSend-compliant response.
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * const options = {
   *   url: "https://api.recipe.report/register",
   *   json: {
   *     "email": "no-reply@recipe.report",
   *     "password": "testPassword"
   *   }
   * };
   * request.post(options, function(err, res, body) {
   *   if (!err && res.statusCode == 200) {
   *     console.log(body);
   *   }
   * });
   */
  app.post('/register', (req, res) =>
    emailLooksOk(req.body.email)
      .then(() => registerAccount(req.body.email, req.body.password))
      .then(account => generateToken(account))
      .then(token => sendActivationEmail(req.body.email, req.headers, token))
      .then(reply => respond.success(res, `Registration successful`, reply))
      .catch(err => respond.error(res, err)))

  /**
   * GET request to the activate route. Activates an account based on the token
   * provided. Responds with a JSend-compliant response.
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * request("https://api.recipe.report/activate/secret-token",
   *   function (err, response, body) {
   *     if (!err && res.statusCode == 200) {
   *       console.log(body);
   *     }
   *   });
   */
  app.get('/activate/:token', (req, res) =>
    verifyToken(req.params.token)
      .then(decoded => {
      // TODO: Actually activate the account.
        console.dir(decoded)
        respond.success(res, 'Activation successful.')
      })
      .catch(err => respond.error(res, err)))

  /**
   * POST request to the login route. Authenticates an account based on the
   * email address and password provided. Generates a token with payload
   * containing user._doc._id. Responds with a JSend-compliant response,
   * including the token.
   * @public
   * @function
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * const options = {
   *   url: "https://api.recipe.report/login",
   *   json: {
   *     "email": "no-reply@recipe.report",
   *     "password": "temp"
   *   }
   * };
   * request.post(options, function(err, res, body) {
   *   if (!err && res.statusCode == 200) {
   *     console.log(body);
   *   }
   * });
   */
  app.post('/login', passport.authenticate('local'), (req, res) =>
    generateToken(req.user)
      .then(token => respond.success(res, 'Authentication successful.', {
        token: token
      }))
      .catch(err => respond.error(res, err)))

  /**
   * Middleware for token verification. Applies to all routes below. On success,
   * adds decoded payload data to the request object and then calls next. On
   * error, responds with a JSend-compliant response.
   */
  app.use((req, res, next) =>
    verifyToken(req.headers.token)
      .then(decoded => {
        req.decoded = decoded.data
        return next()
      })
      .catch(err => respond.error(res, err)))

  /**
   * GET request to the test route. Responds with a JSend-compliant response
   * @memberof! routes.router
   * @example
   * const request = require("request");
   * const options = {
   *   url: "https://api.recipe.report/test",
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
  app.get('/tokentest', (req, res) =>
    // This is just here for development and debugging purposes.
    // req.decoded holds the account document ID.
    respond.success(res,
      'Welcome to the team, DZ-015.', {
        encryptedID: req.decoded,
        decryptedID: crypt.decrypt(req.decoded.toString())
      }))
}

module.exports = router
