#!/usr/bin/env node

'use strict'

/**
 * The test-route controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const responds = require(`../lib/responds`)

function success (req, res) {
  responds.success(res, `Welcome to the team, DZ-${req.accountId}.`)
}

function throws (req, res) {
  let error = new Error(`Purposeful error to check expressjs error handling middleware.`)
  error.name = `PurposefulError`
  throw error
}

module.exports = {
  success: success,
  throws: throws
}
