#!/usr/bin/env node

'use strict'

/**
 * Expressjs API for the Recipe Report application.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 * @see {@link https://github.com/expressjs/body-parser body-parser}
 * @see {@link https://github.com/expressjs/express expressjs}
 * @see {@link https://github.com/helmetjs helmetjs}
 * @see {@link https://github.com/nodenica/node-heroku-ssl-redirect heroku ssl}
 * @see {@link https://nodejs.org/api/http.html http}
 */
const bodyParser = require('body-parser')
const db = require('./lib/db')
const expressjs = require('express')
const fun = require('./lib/fun')
const helmet = require('helmet')
const herokuSslRedirect = require('heroku-ssl-redirect')
const http = require('http')
const router = require('./routes/router')

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
      'contentSecurityPolicy': { 'directives': { 'defaultSrc': ["'self'"] } },
      'referrerPolicy': { 'policy': 'same-origin' }
    }))
    express.use(herokuSslRedirect())
    express.use(bodyParser.json())
    express.use(bodyParser.urlencoded({ extended: true }))
    express.set('json spaces', 2)
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
    express.use((req, res, next) => res.status(404).send('four, oh four!'))
    express.use((err, req, res, next) => {
      res.status(500).send('Something broke!')
      console.log(err)
    })
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
    server.listen(port, () => {
      console.log(` \x1b[1m\x1b[33m>\x1b[0m \x1b[1m\x1b[36mListening on port ${port}\x1b[0m`)
      resolve()
    })
  })
}

/**
 * Create the API parts in proper order.
 */
async function main () {
  await fun.applicationName()
  await db.connect()
  let express = await expressInstance()
  await expressConfigure(express)
  await expressRoutes(express)
  await expressErrors(express)
  let server = await serverInstance(express)
  await serverListen(server)
}

main()
