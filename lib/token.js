#!/usr/bin/env node

'use strict'

/**
 * JSON Web Token utilities.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 * @see {@link https://github.com/auth0/node-jsonwebtoken node-jsonwebtoken}
 */
const crypt = require('./crypt')
const jsonwebtoken = require('jsonwebtoken')

function accountDefined (account) {
  return new Promise((resolve, reject) => {
    if (account !== undefined && account.id !== undefined) resolve(account)
    else reject(new Error(`Account required for token generation.`))
  })
}

function tokenDefined (token) {
  return new Promise((resolve, reject) => {
    if (token !== undefined) resolve(token)
    else reject(new Error(`Unauthorized.`))
  })
}

function sign (account) {
  return new Promise((resolve, reject) =>
    jsonwebtoken.sign({
      data: crypt.encrypt(account.id.toString())
    }, process.env.JWT_SECRET, {
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: 172800 // Two days (in seconds)
    }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    }))
}

function verify (token) {
  return new Promise((resolve, reject) =>
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded)
    }))
}

function decode (token) {
  return new Promise(resolve => {
    const decoded = jsonwebtoken.decode(token, { complete: true })
    resolve(decoded)
  })
}

module.exports = {
  accountDefined: accountDefined,
  tokenDefined: tokenDefined,
  sign: sign,
  verify: verify,
  decode: decode
}
