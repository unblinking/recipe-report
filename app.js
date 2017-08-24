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
 * @see {@link https://github.com/Automattic/mongoose mongoose}
 * @see {@link https://github.com/jaredhanson/passport passport}
 *
 */
const bodyParser = require('body-parser')
const expressjs = require('express')
const helmet = require('helmet')
const herokuSslRedirect = require('heroku-ssl-redirect')
const http = require('http')
const mongoose = require('mongoose')
const packageJson = require('./package.json')
const passport = require('passport')
const routes = require('./routes/routes')

/**
 * Something fun!
 * @see {@link http://patorjk.com/software/taag/#p=display&h=2&v=2&f=Standard&t=Recipe%0AReport TAAG}
 * @see {@link https://stackoverflow.com/a/41407246 nodejs console font color}
 */
function somethingFun () {
  return new Promise(resolve => {
    console.log(`\x1b[1m\x1b[32m
  ____           _
 |  _ \\ ___  ___(_)_ __   ___
 | |_) / _ \\/ __| | '_ \\ / _ \\
 |  _ <  __/ (__| | |_) |  __/
 |_|_\\_\\___|\\___|_| .__/ \\___|
 |  _ \\ ___ _ __  |_|_  _ __| |_
 | |_) / _ \\ '_ \\ / _ \\| '__| __|
 |  _ <  __/ |_) | (_) | |  | |_
 |_| \\_\\___| .__/ \\___/|_|   \\__|
           |_|     \x1b[37m version ${packageJson.version}
    \x1b[0m`)
    resolve()
  })
}

/**
 * Connect mongoose to the MongoDB datastore.
 */
async function dbConnect () {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost/'
    await mongoose.connect(uri, {useMongoClient: true})
    console.log(` \x1b[1m\x1b[33m>\x1b[0m \x1b[1m\x1b[36mConnected to MongoDB datastore\x1b[0m`)
  } catch (err) {
    console.log(` \x1b[1m\x1b[33m>\x1b[0m \x1b[1m\x1b[36mError connecting to MongoDB datastore\x1b[0m
    ${JSON.stringify(err)}`)
  }
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
 * Configure the expressjs application.
 * Define all expressjs configurations here (except routes, define routes last).
 * @param {Object} express The expressjs instance.
 */
function expressConfigure (express) {
  return new Promise(resolve => {
    express.use(helmet())
    if (process.env.NODE_ENV === 'production') express.use(herokuSslRedirect())
    express.use(bodyParser.json())
    express.use(bodyParser.urlencoded({
      extended: true // When true uses {@link https://github.com/ljharb/qs qs} querystring parsing.
    }))
    express.use(passport.initialize())
    express.set('json spaces', 2)
    resolve()
  })
}

/**
 * Define the expressjs routes.
 * @param {Object} express The expressjs instance.
 * @see {@link https://expressjs.com/en/guide/routing.html expressjs routing}
 */
function expressRoutes (express) {
  return new Promise(resolve => {
    routes(express)
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
      console.log(err.message)
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
    const port = parseInt(process.env.PORT, 10) || 1138
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
  await somethingFun()
  await dbConnect()
  let express = await expressInstance()
  await expressConfigure(express)
  await expressRoutes(express)
  await expressErrors(express)
  let server = await serverInstance(express)
  await serverListen(server)
}
exports.main = main // For testing with supertest

main()
