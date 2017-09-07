#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the cryptographic functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypts = require(`../../lib/crypts`)

describe(`Cryptographic functions.`, () => {
  it(`should set the required env vars.`,
    () => {
      process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
    }
  )
  it(`should encrypt a given string.`,
    async () => {
      const plainText = `Secret words`
      const encrypted = await crypts.encrypt(plainText)
      encrypted.should.not.equal(plainText)
      encrypted.length.should.equal(44)
    }
  )
  it(`should encrypt a given string twice, resulting in a unique ciphertexts.`,
    async () => {
      const plainText = `Secret words`
      const encrypted1 = await crypts.encrypt(plainText)
      const encrypted2 = await crypts.encrypt(plainText)
      encrypted1.should.not.equal(encrypted2)
    }
  )
  it(`should decrypt an encrypted string.`,
    async () => {
      const plainText = `Secret words`
      const encrypted = await crypts.encrypt(plainText)
      encrypted.should.not.equal(plainText)
      const decrypted = await crypts.decrypt(encrypted)
      decrypted.should.equal(plainText)
    }
  )
  it(`should clean up the required env vars.`,
    () => {
      delete process.env.CRYPTO_KEY
    }
  )
})
