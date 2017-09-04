#!/usr/bin/env node

'use strict'

/**
 * The access-token-test-route controller.
 * I used this to see if the tokenwall middleware worked.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')

function test (req, res) {
  respond.success(res, `Welcome to the team, DZ-${req.accountId}.`)
}

function throws (req, res) {
  let error = new Error(`Purposeful error to check expressjs error handling middleware.`)
  error.name = `PurposefulError`
  throw error
}

module.exports = {
  test: test,
  throws: throws
}
