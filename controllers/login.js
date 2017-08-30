#!/usr/bin/env node

'use strict'

/**
 * The login controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')
const token = require('../lib/token')

async function accessToken (req, res) {
  try {
    const Token = await token.sign(req.user)
    respond.success(res, `Authentication successful.`, {
      token: Token
    })
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  accessToken: accessToken
}
