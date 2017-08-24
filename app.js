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
 * @see {@link https://github.com/nodenica/node-heroku-ssl-redirect ssl-redirect}
 * @see {@link https://github.com/Automattic/mongoose mongoose}
 * @see {@link https://github.com/jaredhanson/passport passport}
 *
 */
const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const herokuSslRedirect = require('heroku-ssl-redirect')
const mongoose = require('mongoose')
const packageJson = require('./package.json')
const passport = require('passport')
const respond = require('./lib/respond')
const routes = require('./routes/routes')

/**
 * Something fun!
 */
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
dbConnect()

/**
 * Instantiate the Express application and define all app configurations here except routes (define routes last).
 */
const app = express()
app.use(helmet())
if (process.env.NODE_ENV === 'production') app.use(herokuSslRedirect())
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
 * @see {@link https://expressjs.com/en/api.html#app.listen expressjs listen}
 * @see {@link http://patorjk.com/software/taag/#p=display&h=2&v=2&f=Standard&t=Recipe%0AReport TAAG}
 * @see {@link https://stackoverflow.com/a/41407246 nodejs console font color}
 */
const port = parseInt(process.env.PORT, 10) || 1138
app.listen(port, () =>
  console.log(` \x1b[1m\x1b[33m>\x1b[0m \x1b[1m\x1b[36mListening on port ${port}\x1b[0m`)
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
