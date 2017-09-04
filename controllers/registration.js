#!/usr/bin/env node

'use strict'

/**
 * The registration-route controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const accounts = require(`../lib/accounts`)
const Account = require(`../models/account`)
const crypts = require(`../lib/crypts`)
const emails = require(`../lib/emails`)
const tokens = require(`../lib/tokens`)
const responds = require(`../lib/responds`)

async function creation (req, res) {
  try {
    await emails.check(req.body.email)
    const account = await accounts.create(req.body.email, req.body.password)
    const token = await tokens.sign(account, { type: `activation` })
    const render = await emails.render(req.body.email, token)
    const reply = await emails.send(render.from, req.body.email, render.subject, render.text)
    responds.success(res, `Registration successful.`, reply)
  } catch (err) {
    responds.error(res, err)
  }
}

async function activation (req, res) {
  try {
    const decoded = await tokens.verify(req.params.token)
    const accountId = await crypts.decrypt(decoded.id.toString())
    if (decoded.type === undefined || decoded.type !== `activation`) {
      let activationError = new Error(`Token type not activation.`)
      activationError.name = `RegistrationActivationError`
      throw activationError
    }
    let account = await Account.findOne({ _id: accountId })
    if (account === null || account === undefined) {
      let activationError = new Error(`Account not found.`)
      activationError.name = `RegistrationActivationError`
      throw activationError
    }
    account.activated = true
    await account.save()
    responds.success(res, `Activation successful.`)
  } catch (err) {
    responds.error(res, err)
  }
}

module.exports = {
  creation: creation,
  activation: activation
}
