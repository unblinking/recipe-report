#!/usr/bin/env node

'use strict'

/**
 * Token functions, using JSON web tokens.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypts = require('./crypts')
const jsonwebtoken = require('jsonwebtoken')

function sign (account, options) {
  return new Promise((resolve, reject) => {
    if (account === undefined || account.id === undefined) {
      let accountError = new Error(`Account not found.`)
      accountError.name = `TokenSignError`
      reject(accountError)
    }
    if (options === undefined) options = {}
    if (options.type === undefined) options.type = `access`
    if (options.expiresIn === undefined) options.expiresIn = 172800 // Two days
    const token = jsonwebtoken.sign(
      { id: crypts.encrypt(account.id.toString()), type: options.type },
      process.env.JWT_SECRET,
      { algorithm: process.env.JWT_ALGORITHM, expiresIn: options.expiresIn }
    )
    resolve(token)
  })
}

function verify (token) {
  return new Promise((resolve, reject) => {
    if (token === undefined) {
      let tokenError = new Error(`Error reading token.`)
      tokenError.name = `TokenVerifyError`
      reject(tokenError)
    }
    const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET)
    resolve(verified)
  })
}

function decode (token) {
  return new Promise((resolve, reject) => {
    if (token === undefined) {
      let tokenError = new Error(`Error reading token.`)
      tokenError.name = `TokenVerifyError`
      reject(tokenError)
    }
    const decoded = jsonwebtoken.decode(token, { complete: true })
    resolve(decoded)
  })
}

module.exports = {
  sign: sign,
  verify: verify,
  decode: decode
}
