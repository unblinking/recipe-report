#!/usr/bin/env node

'use strict'

/**
 * Expressjs API for the Recipe Report application.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const bodyParser = require(`body-parser`)
const error = require(`./lib/error.js`)
const expressjs = require(`express`)
const fun = require(`./lib/fun`)
const helmet = require(`helmet`)
const herokuSslRedirect = require(`heroku-ssl-redirect`)
const http = require(`http`)
const mongoose = require('mongoose')
const router = require(`./routes/router`)

/**
 * Instantiate the expressjs application.
 */
function expressInstance () {
  return new Promise(resolve => {
    let express = expressjs()
    resolve(express)
  })
}

/**
 * Middleware configuration for the expressjs application.
 * Define all expressjs configurations here (except routes, define routes last).
 * @param {Object} express The expressjs instance.
 */
function expressConfigure (express) {
  return new Promise(resolve => {
    express.use(helmet({
      contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
      referrerPolicy: { policy: `same-origin` }
    }))
    express.use(herokuSslRedirect())
    express.use(bodyParser.json())
    express.use(bodyParser.urlencoded({ extended: true }))
    express.set(`json spaces`, 2)
    resolve()
  })
}

/**
 * Define the expressjs routes.
 * @param {Object} express The expressjs instance.
 */
function expressRoutes (express) {
  return new Promise(resolve => {
    router.initialize(express)
    resolve()
  })
}

/**
 * Define the expressjs error handling middleware.
 * @param {Object} express The expressjs instance.
 */
function expressErrors (express) {
  return new Promise(resolve => {
    express.use(error.handle404)
    express.use(error.handle500)
    resolve()
  })
}

/**
 * Instantiate the http server.
 * @param {Object} express The expressjs instance.
 */
function serverInstance (express) {
  return new Promise(resolve => {
    let server = http.Server(express)
    resolve(server)
  })
}

/**
 * Listen for http server connections.
 * @param {Object} server The http server instance.
 */
function serverListen (server) {
  return new Promise(resolve => {
    const port = parseInt(process.env.PORT, 10)
    server.listen(port, () => resolve())
  })
}

/**
 * Create the API parts in proper order.
 */
async function main () {
  await fun.applicationName()
  let express = await expressInstance()
  await expressConfigure(express)
  await expressRoutes(express)
  await expressErrors(express)
  let server = await serverInstance(express)
  await serverListen(server)
}

/**
 * Only start main() once the database is connected.
 */
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})
mongoose.connection.once(`connected`, main)
