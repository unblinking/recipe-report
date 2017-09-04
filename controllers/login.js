#!/usr/bin/env node

'use strict'

/**
 * The login-route controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')
const token = require('../lib/token')

async function accessToken (req, res) {
  const Token = await token.sign(req.user)
  respond.success(res, `Authentication successful.`, {
    token: Token
  })
}

module.exports = {
  accessToken: accessToken
}
