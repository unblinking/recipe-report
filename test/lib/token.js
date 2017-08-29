#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the JSON Web Token generator.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const AccountModel = require('../../models/account')
const crypt = require('../../lib/crypt')
const token = require('../../lib/token')
const theMoment = require('moment')

/**
 * Account model to use during the tests.
 */
const Account = new AccountModel({
  email: process.env.MOCHA_USERNAME
})

describe(`JSON Web Token tests.`, () => {
  it(`Should generate and return a JSON web token that can be decoded`, () =>
    token.accountDefined(Account)
      .then(definedAccount => token.sign(definedAccount))
      .then(Token => token.tokenDefined(Token))
      .then(Token => token.decode(Token))
      .then(decoded => {
        describe('Decoded JWT headers', () => {
          it(`Algorithm should equal 'HS256'.`, () =>
            decoded.header.alg.should.equal('HS256') // Different algorithm than production
          )
          it(`Type should equal 'JWT'.`, () =>
            decoded.header.typ.should.equal('JWT')
          )
        })
        describe('Decoded JWT payload', () => {
          it(`Data should equal the account model ID.`, () =>
            crypt.decrypt(decoded.payload.data).should.equal(Account._id.toString())
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
      })
  )
  it(`Should generate and return a JSON web token that can be verified`, () =>
    token.accountDefined(Account)
      .then(definedAccount => token.sign(definedAccount))
      .then(Token => token.tokenDefined(Token))
      .then(Token => token.verify(Token))
      .then(decoded => {
        describe('Verified JWT payload', () => {
          it(`Data should equal the account model ID.`, () =>
            crypt.decrypt(decoded.data).should.equal(Account._id.toString())
          )
          it(`Issued date (in seconds) should equal today.`, () => {
            const itWasIssued = decoded.iat * 1000
            theMoment(itWasIssued).isSame(Date.now(), 'day').should.equal(true)
          })
          it(`Expiration date is in 2 days.`, () => {
            const itExpires = decoded.exp * 1000
            theMoment(itExpires).fromNow().should.equal('in 2 days')
          })
        })
      })
  )
})
