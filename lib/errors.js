#!/usr/bin/env node

'use strict'

/**
 * Error handling for expressjs.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

function handle404 (req, res, next) {
  res.status(404).send(`four, oh four!`)
}

function handle500 (error, req, res, next) {
  res.status(500).send(`five hundred! ${error.name}`)
}

module.exports = {
  handle404: handle404,
  handle500: handle500
}
