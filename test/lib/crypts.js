#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the cryptographic functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypts = require(`../../lib/crypts`)

describe(`Cryptographic operations`, () => {
  before(() => {
    // Set the required environmental variables.
    process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
  })
  it(`should encrypt a given plaintext.`,
    async () => {
      const thePlainText = `Secret words`
      const theCiphertext = await crypts.encrypt(thePlainText)
      theCiphertext.should.not.equal(thePlainText)
      theCiphertext.length.should.equal(44)
    }
  )
  it(`should encrypt a given plaintext twice, resulting in unique ciphertexts.`,
    async () => {
      const thePlainText = `Secret words`
      const theFirstCiphertext = await crypts.encrypt(thePlainText)
      const theSecondCiphertext = await crypts.encrypt(thePlainText)
      theFirstCiphertext.should.not.equal(theSecondCiphertext)
    }
  )
  it(`should decrypt an encrypted string.`,
    async () => {
      const theOriginalPlainText = `Secret words`
      const theCiphertext = await crypts.encrypt(theOriginalPlainText)
      theCiphertext.should.not.equal(theOriginalPlainText)
      const theDecryptedCiphertext = await crypts.decrypt(theCiphertext)
      theDecryptedCiphertext.should.equal(theOriginalPlainText)
    }
  )
  after(() => {
    // Clean up the required environmental variables.
    delete process.env.CRYPTO_KEY
  })
})
