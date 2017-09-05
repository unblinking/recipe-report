#!/usr/bin/env node

'use strict'

/**
 * The login-route controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const responds = require(`../lib/responds`)
const tokens = require(`../lib/tokens`)

async function access (req, res) {
  const token = await tokens.sign(req.user)
  responds.success(res, `Authentication successful.`, { token: token })
}

module.exports = {
  access: access
}
