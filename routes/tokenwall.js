#!/usr/bin/env node

'use strict'

/**
 * The registration route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypt = require('../lib/crypt')
const respond = require('../lib/respond')
const token = require('../lib/token')

async function middleware (req, res, next) {
  try {
    const decodedToken = await token.verify(req.headers.token)
    if (decodedToken.type === `access`) {
      const accountId = crypt.decrypt(decodedToken.id.toString())
      req.accountId = accountId
    } else {
      let tokenwallError = new Error(`Token type is not access.`)
      tokenwallError.name = `TokenwallError`
      throw tokenwallError
    }
    next()
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  middleware: middleware
}
