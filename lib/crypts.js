#!/usr/bin/env node

'use strict'

/**
 * Stronger Encryption and Decryption in Node.js
 * Original Gist
 * @author {@link https://github.com/vlucas Vance Lucas}
 * @see {@link https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb Gist}
 * Forked Gist of the original Gist
 * @author {@link https://github.com/Miki79 Miki}
 * @see {@link https://gist.github.com/Miki79/7e8d5d3798343e0d178863cbce4fe355 Gist}
 */

const crypto = require(`crypto`)

/**
 * process.env.CRYPTO_KEY must be 256 bytes (32 characters)
 * ivLength for AES is always 16
 */

/**
 * Encrypt something.
 */
function encrypt (text) {
  let key = process.env.CRYPTO_KEY
  let ivLength = 16
  let iv = crypto.randomBytes(ivLength)
  let cipher = crypto.createCipheriv(`aes-256-cbc`, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  let buffer = Buffer.concat([encrypted, cipher.final(), iv]).toString(`base64`)
  return buffer
}
exports.encrypt = encrypt

/**
 * Decrypt something.
 */
function decrypt (text) {
  let key = process.env.CRYPTO_KEY
  let ivLength = 16
  let bynaryText = Buffer.from(text, `base64`)
  let encryptedLength = bynaryText.length - ivLength
  let iv = bynaryText.slice(encryptedLength)
  let encryptedText = bynaryText.slice(0, encryptedLength)
  let decipher = crypto.createDecipheriv(`aes-256-cbc`, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  let buffer = Buffer.concat([decrypted, decipher.final()]).toString()
  return buffer
}
exports.decrypt = decrypt
