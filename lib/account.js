#!/usr/bin/env node

'use strict'

/**
 * Account functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 */
const AccountModel = require('../models/account')
const jwt = require('./jwt')
const mail = require('./email')
const respond = require('./respond')

/**
 * Create a new user account in the datastore.
 * @param {string} email New user account email address.
 * @param {string} password New user account password.
 * @returns {object} Registered new user account object.
 */
function createAcctInDatastore (email, password) {
  return new Promise((resolve, reject) => {
    AccountModel.register(new AccountModel({
      email: email
    }), password, (err, account) => {
      if (err) reject(err)
      else resolve(account)
    })
  })
}

/**
 * Do a complete new user account registration.
 * Verify that the new user account email looks ok, then create the account in
 * the datastore, then generate a json web token to use in the activation email,
 * then send the activation email, then respond to the original request.
 * @param  {string} email New user account email address.
 * @param  {string} password New user account password.
 * @param  {object} headers Headers from the original request, to include with
 * the activation email.
 * @param  {object} res The expressjs response object.
 */
async function registration (email, password, headers, res) {
  try {
    await mail.looksOk(email)
    const account = await createAcctInDatastore(email, password)
    const token = await jwt.generateToken(account)
    const reply = await mail.sendActivation(email, headers, token)
    respond.success(res, `Registration successful`, reply)
  } catch (err) {
    respond.error(res, err)
  }
}
exports.registration = registration
