#!/usr/bin/env node

'use strict'

/**
 * The registration controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const account = require('../lib/account')
const email = require('../lib/email')
const token = require('../lib/token')
const respond = require('../lib/respond')

async function newAccount (req, res) {
  try {
    await email.looksOk(req.body.email)
    const Account = await account.create(req.body.email, req.body.password)
    const Token = await token.generate(Account)
    const reply = await email.sendActivation(req.body.email, req.headers, Token)
    respond.success(res, `Registration successful`, reply)
  } catch (err) {
    respond.error(res, err)
  }
}

async function activate (req, res) {
  try {
    const decoded = await token.verifyToken(req.params.token)
    // TODO: Actually activate the account.
    // console.dir(decoded)
    respond.success(res, 'Activation successful.')
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  newAccount: newAccount,
  activate: activate
}
