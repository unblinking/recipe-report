#!/usr/bin/env node

'use strict'

/**
 * The registration controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypt = require('../lib/crypt')
const respond = require('../lib/respond')

async function test (req, res) {
  try {
    respond.success(
      res,
      'Welcome to the team, DZ-015.', {
        encryptedID: req.decoded,
        decryptedID: crypt.decrypt(req.decoded.toString())
      }
    )
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  test: test
}
