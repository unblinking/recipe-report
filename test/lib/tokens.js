#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the JSON Web Token generator.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const Account = require('../../models/account')
const crypts = require('../../lib/crypts')
const tokens = require('../../lib/tokens')
const theMoment = require('moment')

describe(`Token operations`, () => {
  before(() => {
    // Set the required environmental variables.
    process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
    process.env.JWT_SECRET = `devTestEnvironment`
    process.env.JWT_ALGORITHM = `HS256`
  })
  it(`should sign and decode a JWT, header.alg HS256, header.typ JWT, payload.id equal to the Account ID, payload.type of 'access', payload.iat today, and payload.exp in 2 days.`,
    async () => {
      const account = new Account({
        email: `${new Date().getTime()}@ReCiPe.RePoRt`
      })
      const token = await tokens.sign(account, { type: 'access' })
      const decoded = await tokens.decode(token)
      decoded.header.alg.should.equal(`HS256`) // Different algorithm than production
      decoded.header.typ.should.equal(`JWT`)
      crypts.decrypt(decoded.payload.id).should.equal(account.id.toString())
      decoded.payload.type.should.equal(`access`)
      const itWasIssued = decoded.payload.iat * 1000
      theMoment(itWasIssued).isSame(Date.now(), `day`).should.equal(true)
      const itExpires = decoded.payload.exp * 1000
      theMoment(itExpires).fromNow().should.equal(`in 2 days`)
    }
  )
  it(`should sign and decode a JWT, header.alg HS256, header.typ JWT, payload.id equal to the Account ID, payload.type 'activation', payload.iat today, and payload.exp in 2 days.`,
    async () => {
      const account = new Account({
        email: `${new Date().getTime()}@ReCiPe.RePoRt`
      })
      const token = await tokens.sign(account, { type: 'activation' })
      const decoded = await tokens.decode(token)
      decoded.header.alg.should.equal(`HS256`) // Different algorithm than production
      decoded.header.typ.should.equal(`JWT`)
      crypts.decrypt(decoded.payload.id).should.equal(account.id.toString())
      decoded.payload.type.should.equal(`activation`)
      const itWasIssued = decoded.payload.iat * 1000
      theMoment(itWasIssued).isSame(Date.now(), `day`).should.equal(true)
      const itExpires = decoded.payload.exp * 1000
      theMoment(itExpires).fromNow().should.equal(`in 2 days`)
    }
  )
  it(`should sign and verify a JWT, id equal to the Account ID, type of 'access', payload.iat today, and payload.exp in 2 days.`,
    async () => {
      const account = new Account({
        email: `${new Date().getTime()}@ReCiPe.RePoRt`
      })
      const token = await tokens.sign(account, { type: 'access' })
      const verified = await tokens.verify(token)
      crypts.decrypt(verified.id).should.equal(account.id.toString())
      verified.type.should.equal(`access`)
      const itWasIssued = verified.iat * 1000
      theMoment(itWasIssued).isSame(Date.now(), `day`).should.equal(true)
      const itExpires = verified.exp * 1000
      theMoment(itExpires).fromNow().should.equal(`in 2 days`)
    }
  )
  it(`should sign and verify a JWT, id equal to the Account ID, type of 'activation', payload.iat today, and payload.exp in 2 days.`,
    async () => {
      const account = new Account({
        email: `${new Date().getTime()}@ReCiPe.RePoRt`
      })
      const token = await tokens.sign(account, { type: 'activation' })
      const verified = await tokens.verify(token)
      crypts.decrypt(verified.id).should.equal(account.id.toString())
      verified.type.should.equal(`activation`)
      const itWasIssued = verified.iat * 1000
      theMoment(itWasIssued).isSame(Date.now(), `day`).should.equal(true)
      const itExpires = verified.exp * 1000
      theMoment(itExpires).fromNow().should.equal(`in 2 days`)
    }
  )
  it(`should sign and verify a JWT, id equal to the Account ID, type of 'access', payload.iat today, and payload.exp in a month.`,
    async () => {
      const account = new Account({
        email: `${new Date().getTime()}@ReCiPe.RePoRt`
      })
      const token = await tokens.sign(account, { type: 'access', expiresIn: 2592000 })
      const verified = await tokens.verify(token)
      crypts.decrypt(verified.id).should.equal(account.id.toString())
      verified.type.should.equal(`access`)
      const itWasIssued = verified.iat * 1000
      theMoment(itWasIssued).isSame(Date.now(), `day`).should.equal(true)
      const itExpires = verified.exp * 1000
      theMoment(itExpires).fromNow().should.equal(`in a month`)
    }
  )
  it(`should sign and decode a JWT, with payload.type of 'access', when the token type is not specified.`,
    async () => {
      const account = new Account({
        email: `${new Date().getTime()}@ReCiPe.RePoRt`
      })
      const token = await tokens.sign(account)
      const decoded = await tokens.decode(token)
      decoded.payload.type.should.equal(`access`)
    }
  )
  it(`should fail to sign a JWT if the Account is undefined, return an error with name 'TokenSignError' and message 'Account not found.'.`,
    async () => {
      try {
        await tokens.sign(undefined, { type: 'access', expiresIn: 2592000 })
      } catch (err) {
        err.name.should.equal(`TokenSignError`)
        err.message.should.equal(`Account not found.`)
      }
    }
  )
  it(`should fail to verify a JWT if the token is not defined.`,
    async () => {
      try {
        await tokens.verify(undefined)
      } catch (err) {
        err.name.should.equal(`TokenVerifyError`)
        err.message.should.equal(`Token is not defined.`)
      }
    }
  )
  it(`should fail to decode a JWT if the token is not defined.`,
    async () => {
      try {
        await tokens.decode(undefined)
      } catch (err) {
        err.name.should.equal(`TokenDecodeError`)
        err.message.should.equal(`Token is not defined.`)
      }
    }
  )
  after(() => {
    // Clean up the required environmental variables.
    delete process.env.JWT_SECRET
    delete process.env.JWT_ALGORITHM
    delete process.env.CRYPTO_KEY
  })
})
