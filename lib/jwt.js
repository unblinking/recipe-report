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

/**
 * Generate a jsonwebtoken
 * @param {Object} account An account model
 */
function generateToken (account) {
  return new Promise((resolve, reject) =>
    accountReceived(account)
      .then(account => sign(account))
      .then(token => resolve(token))
      .catch(err => reject(err)))
}
exports.generateToken = generateToken

function accountReceived (account) {
  return new Promise((resolve, reject) => {
    if (
      account !== undefined &&
      account.id !== undefined
      // account._doc !== undefined &&
      // account._doc._id !== undefined
    ) resolve(account)
    else reject(new Error(`Account required for token generation.`))
  })
}

function sign (account) {
  return new Promise((resolve, reject) =>
    jsonwebtoken.sign({
      // data: account._doc._id
      data: crypt.encrypt(account.id.toString())
    }, process.env.JWT_SECRET, {
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: 172800 // Two days (in seconds)
    }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    }))
}

function verifyToken (token) {
  return new Promise((resolve, reject) =>
    tokenReceived(token)
      .then(token => verify(token))
      .then(decoded => resolve(decoded))
      .catch(err => reject(err)))
}
exports.verifyToken = verifyToken

function tokenReceived (token) {
  return new Promise((resolve, reject) => {
    if (token !== undefined) resolve(token)
    else reject(new Error(`Unauthorized.`))
  })
}

function verify (token) {
  return new Promise((resolve, reject) =>
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded)
    }))
}

function decodeToken (token) {
  return new Promise((resolve, reject) =>
    tokenReceived(token)
      .then(token => decode(token))
      .then(decoded => resolve(decoded))
      .catch(err => reject(err)))
}
exports.decodeToken = decodeToken

function decode (token) {
  return new Promise(resolve => {
    const decoded = jsonwebtoken.decode(token, {
      complete: true
    })
    resolve(decoded)
  })
}
