#!/usr/bin/env node

'use strict'

/**
 * The tokenwall middleware.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypts = require('../lib/crypts')
const responds = require('../lib/responds')
const tokens = require('../lib/tokens')

async function middleware (req, res, next) {
  try {
    const token = await tokens.verify(req.headers.token)
    if (token.type === 'access') {
      const accountId = crypts.decrypt(token.id.toString())
      req.accountId = accountId
    } else {
      const tokenwallError = new Error('Token type is not access.')
      tokenwallError.name = 'TokenwallError'
      throw tokenwallError
    }
    next()
  } catch (err) {
    responds.error(res, err)
  }
}

module.exports = {
  middleware: middleware
}
