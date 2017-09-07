#!/usr/bin/env node

'use strict'

/**
 * Expressjs API for the Recipe Report application.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const parser = require(`body-parser`)
const datastores = require(`./lib/datastores`)
const errors = require(`./lib/errors`)
const expressjs = require(`express`)
const funs = require(`./lib/funs`)
const helmet = require(`helmet`)
const herokuSslRedirect = require(`heroku-ssl-redirect`)
const http = require(`http`)
const router = require(`./routes/router`)

/**
 * Verify required env vars are set.
 */
function environmentals () {
  return new Promise((resolve, reject) => {
    let missing = ``
    if (process.env.MONGODB_URI === undefined) { missing = missing.concat(`\n MONGODB_URI`) }
    if (process.env.PORT === undefined) { missing = missing.concat(`\n PORT`) }
    if (process.env.CRYPTO_KEY === undefined) { missing = missing.concat(`\n CRYPTO_KEY`) }
    if (process.env.JWT_SECRET === undefined) { missing = missing.concat(`\n JWT_SECRET`) }
    if (process.env.JWT_ALGORITHM === undefined) { missing = missing.concat(`\n JWT_ALGORITHM`) }
    if (missing === ``) {
      resolve()
    } else {
      let error = new Error(`Environmental variable(s) missing:${missing}`)
      error.name = `EnvironmentalVariableError`
      reject(error)
    }
  })
}

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
    express.use(parser.json())
    express.use(parser.urlencoded({ extended: true }))
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
    express.use(errors.handle404)
    express.use(errors.handle500)
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
  try {
    await environmentals()
    await datastores.connect()
    let express = await expressInstance()
    await expressConfigure(express)
    await expressRoutes(express)
    await expressErrors(express)
    let server = await serverInstance(express)
    await serverListen(server)
    console.log(await funs.graffiti())
  } catch (err) {
    errors.handleFatal(err)
  }
}

module.exports = {
  main: main
}
