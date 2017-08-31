#!/usr/bin/env node

'use strict'

/**
 * The access-token-test-route controller.
 * I used this to see if the tokenwall middleware worked.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')

async function test (req, res) {
  try {
    respond.success(res, `Welcome to the team, DZ-${req.accountId}.`)
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  test: test
}
