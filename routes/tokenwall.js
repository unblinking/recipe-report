#!/usr/bin/env node

'use strict'

/**
 * The registration route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')
const token = require('../lib/token')

async function middleware (req, res, next) {
  try {
    await token.tokenDefined(req.headers.token)
    const decoded = await token.verify(req.headers.token)
    req.decoded = decoded.data
    next()
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  middleware: middleware
}
