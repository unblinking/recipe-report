#!/usr/bin/env node

'use strict'

/**
 * Account utilities.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 */
const P = require('bluebird')

/**
 * Require the local modules that will be used.
 */
const AccountModel = require('../models/account')

function register (email, password) {
  return new P((resolve, reject) => {
    AccountModel.register(new AccountModel({
      email: email
    }), password, (err, account) => {
      if (err) reject(err)
      else resolve(account)
    })
  })
}
exports.register = register
