#!/usr/bin/env node

'use strict'

/**
 * End point router.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const rootroute = require('./root')
const registration = require('./registration')
const login = require('./login')
const tokenwalltestRoute = require('./tokenwalltest')

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
  express.use('/root', rootroute)
  express.use('/register', registration)
  express.use('/login', login)
  express.use('/tokenwalltest', tokenwalltestRoute)
}

module.exports = {
  initialize: initialize
}
