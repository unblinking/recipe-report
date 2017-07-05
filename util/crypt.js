#!/usr/bin/env node

'use strict'

/**
 * Stronger Encryption and Decryption in Node.js
 *
 * Original Gist
 * @author {@link https://github.com/vlucas Vance Lucas}
 * @see {@link https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb Gist}
 *
 * Forked Gist of the original Gist
 * @author {@link https://github.com/Miki79 Miki}
 * @see {@link https://gist.github.com/Miki79/7e8d5d3798343e0d178863cbce4fe355 Gist}
 */

const crypto = require('crypto')

/**
 * CRYPTO_KEY must be 256 bytes (32 characters)
 * IV_LENGTH for AES is always 16
 */
const CRYPTO_KEY = process.env.CRYPTO_KEY || 'MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT'
const IV_LENGTH = 16

function encrypt (text) {
  let iv = crypto.randomBytes(IV_LENGTH)
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(CRYPTO_KEY), iv)
  let encrypted = cipher.update(text)
  return Buffer.concat([encrypted, cipher.final(), iv]).toString('base64')
}

function decrypt (text) {
  let bynaryText = Buffer.from(text, 'base64')
  let encryptedLength = bynaryText.length - IV_LENGTH
  let iv = bynaryText.slice(encryptedLength)
  let encryptedText = bynaryText.slice(0, encryptedLength)
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(CRYPTO_KEY), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

module.exports = { decrypt, encrypt }
