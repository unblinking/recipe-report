#!/usr/bin/env node

'use strict'

/**
 * Unit test of the JSON Web Token generator.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Required modules.
 */
const AccountModel = require('../../models/account')
const crypt = require('../../lib/crypt')
const token = require('../../lib/token')
const theMoment = require('moment')

/**
 * Account model to use during the tests.
 */
const account = new AccountModel({
  email: process.env.MOCHA_USERNAME
})

/**
 * Tests.
 */
describe(`JSON Web Token generator tests.`, () =>
  it(`Should generate and return a JSON web token that can be decoded`, () =>
    token.generate(account)
      .then(Token => token.decodeToken(Token))
      .then(decoded => {
        describe('JWT headers', () => {
          it(`Algorithm should equal 'HS256'.`, () =>
            decoded.header.alg.should.equal('HS256') // Different algorithm than production
          )
          it(`Type should equal 'JWT'.`, () =>
            decoded.header.typ.should.equal('JWT')
          )
        })
        describe('JWT payload', () => {
          it(`Data should equal the account model ID.`, () =>
            crypt.decrypt(decoded.payload.data).should.equal(account._id.toString())
          )
          it(`Issued date (in seconds) should equal today.`, () => {
            const itWasIssued = decoded.payload.iat * 1000
            theMoment(itWasIssued).isSame(Date.now(), 'day').should.equal(true)
          })
          it(`Expiration date is in 2 days.`, () => {
            const itExpires = decoded.payload.exp * 1000
            theMoment(itExpires).fromNow().should.equal('in 2 days')
          })
        })
      // console.log(decoded)
      })))
