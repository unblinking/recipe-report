#!/usr/bin/env node

'use strict'

/**
 * End point router.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const rootroute = require('./root')
const registration = require('./registration')
const login = require('./login')
const test = require('./test')

function initialize (express) {
  express.get('/', (req, res) => {
    res.redirect('/root')
  })
  express.use('/root', rootroute)
  express.use('/register', registration)
  express.use('/login', login)
  express.use('/test', test)
}

module.exports = {
  initialize: initialize
}
