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

module.exports = {
  success: success
}
