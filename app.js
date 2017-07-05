#!/usr/bin/env node

'use strict'

/**
 * The application entry point.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 * @see {@link https://github.com/expressjs/body-parser Express body-parser}
 * @see {@link https://github.com/expressjs/express Express}
 * @see {@link https://github.com/helmetjs Helmet}
 * @see {@link https://github.com/Automattic/mongoose Mongoose}
 * @see {@link https://github.com/jaredhanson/passport Passport}
 * @see {@link https://github.com/nodenica/node-heroku-ssl-redirect sslRedirect}
 */
const bluebird = require('bluebird')
const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const passport = require('passport')
const sslRedirect = require('heroku-ssl-redirect')

/**
 * Require the local modules that will be used.
 */
const respond = require('./util/respond')
const routes = require('./routes/routes')

/**
 * Define the port for the application entry point to listen on.
 * Use port 1138 if environmental variable PORT is not defined.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt MDN JavaScript parseInt}
 */
const port = parseInt(process.env.PORT, 10) || 1138

/**
 * Connect to the MongoDB instance.
 * Use uri "mongodb://localhost/" if environmental variable MONGODB_URI is not defined.
 */
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/'
mongoose.Promise = bluebird // https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(mongodbUri)
  .catch(err => {
    console.log(err.message)
    process.exit(1)
  })

/**
 * Define all app configurations here except routes (define routes last).
 * Instantiate the Express application.
 */
const app = express()
app.use(helmet())
if (process.env.NODE_ENV === 'production') app.use(sslRedirect())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true // When true uses {@link https://github.com/ljharb/qs qs} querystring parsing.
}))
app.use(passport.initialize())
app.set('json spaces', 2)

/**
 * Define routes last, after all other configurations.
 * @param {object} app - The Express application instance.
 */
routes(app)

/**
 * Listen for connections on the specified port.
 * @see {@link https://expressjs.com/en/api.html#app.listen Express API app.listen}
 */
app.listen(port, () =>
  console.log(`Recipe.Report API listening on port ${port}.`)
).on('error', err => console.log(err))
// TODO: If error, try again a number of times and then give up.

/**
 * Define error-handling middleware after app and route configurations.
 */
app.use((req, res, next) => {
  respond.error(res, new Error('four, oh four!'))
})
app.use((err, req, res, next) => respond.error(res, err))

module.exports = app // For testing with supertest
