#!/usr/bin/env node

'use strict'

/**
 * Account functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const Model = require('../models/account')

/**
 * Create a new account in the datastore.
 * @param {string} email New account email address.
 * @param {string} password New account password.
 * @returns {object} Registered new account object.
 */
function create (email, password) {
  return new Promise((resolve, reject) => {
    Model.register(new Model({ email: email }), password, (err, account) => {
      if (err) reject(err)
      else resolve(account)
    })
  })
}

module.exports = {
  create: create
}
