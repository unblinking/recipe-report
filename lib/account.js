#!/usr/bin/env node

'use strict'

/**
 * Account functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 */
const Model = require('../models/account')

/**
 * Create a new user account in the datastore.
 * @param {string} email New user account email address.
 * @param {string} password New user account password.
 * @returns {object} Registered new user account object.
 */
function create (email, password) {
  return new Promise((resolve, reject) => {
    Model.register(new Model({ email: email }), password, (err, account) => {
      if (err) reject(err)
      else resolve(account)
    })
  })
}
exports.create = create
