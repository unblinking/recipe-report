#!/usr/bin/env node

'use strict'

/**
 * JSON Web Token utilities.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Require the modules that will be used.
 * @see {@link https://github.com/auth0/node-jsonwebtoken node-jsonwebtoken}
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 */
const crypt = require('./crypt')
const jsonwebtoken = require('jsonwebtoken')
const P = require('bluebird')

/**
 * Json Web Token configuration.
 */
const jwtSecret = process.env.JWT_SECRET || 'devTestEnvironment'
const jwtAlgorithm = process.env.JWT_ALGORITHM || 'HS256'
const jwtExpires = 172800 // Two days (in seconds)

/**
 * Generate a jsonwebtoken
 * @param {Object} account An account model
 */
function generateToken (account) {
  return new P((resolve, reject) =>
    accountReceived(account)
      .then(() => sign(account))
      .then(token => resolve(token))
      .catch(err => reject(err)))
}
exports.generateToken = generateToken

function accountReceived (account) {
  return new P((resolve, reject) => {
    if (
      account !== undefined &&
      account._doc !== undefined &&
      account._doc._id !== undefined
    ) resolve(account)
    else reject(new Error(`Account required for token generation.`))
  })
}

function sign (account) {
  return new P((resolve, reject) =>
    jsonwebtoken.sign({
      // data: account._doc._id
      data: crypt.encrypt(account._doc._id.toString())
    }, jwtSecret, {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpires
    }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    }))
}

function verifyToken (token) {
  return new P((resolve, reject) =>
    tokenReceived(token)
      .then(token => verify(token))
      .then(decoded => resolve(decoded))
      .catch(err => reject(err)))
}
exports.verifyToken = verifyToken

function tokenReceived (token) {
  return new P((resolve, reject) => {
    if (token !== undefined) resolve(token)
    else reject(new Error(`Unauthorized.`))
  })
}

function verify (token) {
  return new P((resolve, reject) =>
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded)
    }))
}

function decodeToken (token) {
  return new P((resolve, reject) =>
    tokenReceived(token)
      .then(token => decode(token))
      .then(decoded => resolve(decoded))
      .catch(err => reject(err)))
}
exports.decodeToken = decodeToken

function decode (token) {
  return new P(resolve => {
    const decoded = jsonwebtoken.decode(token, {
      complete: true
    })
    resolve(decoded)
  })
}
