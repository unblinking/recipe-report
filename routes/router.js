#!/usr/bin/env node

'use strict'

/**
 * End point router.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const rootRoute = require('./root')
const registerRoute = require('./register')
const loginRoute = require('./login')
const tokenwall = require('./tokenwall')
const tokentestRoute = require('./tokentest')

/*
function debugLog (express) {
  express.get('*', function (req, res, next) {
    console.log('GET request was made to: ' + req.originalUrl)
    return next()
  })
  express.post('*', function (req, res, next) {
    console.log('POST request was made to: ' + req.originalUrl)
    return next()
  })
}
*/

function initialize (express) {
  // debugLog(express)
  express.get('/', (req, res) => {
    res.redirect('/root')
  })
  express.use('/root', rootRoute)
  express.use('/register', registerRoute)
  express.use('/login', loginRoute)
  express.use(tokenwall.middleware)
  express.use('/tokentest', tokentestRoute)
}

module.exports = {
  initialize: initialize
}
