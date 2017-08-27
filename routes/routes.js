#!/usr/bin/env node

'use strict'

/**
 * Application end points (routes).
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 * @see {@link https://github.com/jaredhanson/passport Passport}
 */
const Account = require('../models/account')
const acct = require('../lib/account')
const crypt = require('../lib/crypt')
const generateToken = require('../lib/jwt').generateToken
const passport = require('passport')
const respond = require('../lib/respond')
const verifyToken = require('../lib/jwt').verifyToken

/**
 * Setup Passport.
 */
passport.use(Account.createStrategy())

/**
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html Express API}
 */
const router = (app) => {
  /**
   * GET request to the root route. Responds with a JSend-compliant response.
   */
  app.get('/', (req, res) =>
    respond.success(res, 'This is the http://www.Recipe.Report API server.', {
      headers: req.headers
    })
  )

  /**
   * POST request to the register route. Registers a new user account.
   */
  app.post('/register', (req, res) =>
    acct.registration(req.body.email, req.body.password, req.headers, res)
  )

  /**
   * GET request to the activate route. Activates an account based on the token
   * provided. Responds with a JSend-compliant response.
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
   */
  app.post('/login', passport.authenticate('local', {
    'session': false
  }), (req, res) =>
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
