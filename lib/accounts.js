#!/usr/bin/env node

'use strict'

/**
 * Account management wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const Account = require(`../models/account`)

/**
 * Create a new account in the datastore.
 * @param {string} email New account email address.
 * @param {string} password New account password.
 * @returns {object} Registered new account object.
 */
function create (email, password) {
  return new Promise((resolve, reject) => {
    Account.register(new Account({ email: email }), password, (err, acct) => {
      if (err) {
        reject(err)
      } else {
        resolve(acct)
      }
    })
  })
}

module.exports = {
  create: create
}
