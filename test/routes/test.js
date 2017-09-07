#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the token-validation-test route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const accounts = require(`../../lib/accounts`)
const supertest = require(`supertest`)
const server = supertest(`http://localhost:1138`)
const tokens = require(`../../lib/tokens`)

describe(`GET /test (tokenwall authentication test)`, () => {
  before(async () => {
    // Prepare access and activation tokens.
    process.env.TEST_ACCOUNT_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
    const email = process.env.TEST_ACCOUNT_USERNAME
    process.env.TEST_ACCOUNT_PASSWORD = new Date().getTime()
    const password = process.env.TEST_ACCOUNT_PASSWORD
    const account = await accounts.create(email, password)
    process.env.MOCHA_ACCESS_ACCT_ID = account._id
    const accessToken = await tokens.sign(account, { type: `access` })
    process.env.MOCHA_ACCESS_TOKEN = accessToken
    const activationToken = await tokens.sign(account, { type: `activation` })
    process.env.MOCHA_ACTIVATION_TOKEN = activationToken
  })
  it(`should respond with json, status 200, body.status of 'success', and
      body.message of 'Welcome to the team, DZ-015.', when request sends a
      valid access token in the header.`,
    async () => {
      const res = await server.get(`/test`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .set(`token`, process.env.MOCHA_ACCESS_TOKEN)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      const accountId = process.env.MOCHA_ACCESS_ACCT_ID
      res.body.message.should.equal(`Welcome to the team, DZ-${accountId}.`)
    }
  )
  it(`should respond with json, status 200, body.status of 'error',
      body.message of 'Token type is not access.', and body.json.name of
      'TokenwallError', when request sends an activation token in the header
      instead of an access token.`,
    async () => {
      const res = await server.get(`/test`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .set(`token`, process.env.MOCHA_ACTIVATION_TOKEN)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Token type is not access.`)
      res.body.json.name.should.equal(`TokenwallError`)
    }
  )
  it(`should respond with json, status 200, body.status of 'error',
      body.message of 'jwt malformed', and body.json.name of 'JsonWebTokenError'
      when request sends an invalid authentication token in the header.`,
    async () => {
      const res = await server.get(`/test`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .set(`token`, `invalidAuthenticationToken`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`jwt malformed`)
      res.body.json.name.should.equal(`JsonWebTokenError`)
    }
  )
  it(`should respond with json, status 200, body.status of 'error',
      body.message of 'jwt must be provided', and body.json.name of
      'JsonWebTokenError' when request sends an empty authentication token in
      the header.`,
    async () => {
      const res = await server.get(`/test`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .set(`token`, ``)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`jwt must be provided`)
      res.body.json.name.should.equal(`JsonWebTokenError`)
    }
  )
  it(`should respond with json, status 200, body.status of 'error',
      body.message of 'Error reading token.', and body.json.name of
      'TokenVerifyError' when request does not send any token in the header.`,
    async () => {
      const res = await server.get(`/test`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Token is not defined.`)
      res.body.json.name.should.equal(`TokenVerifyError`)
    }
  )
  after(() => {
    delete process.env.TEST_ACCOUNT_USERNAME
    delete process.env.TEST_ACCOUNT_PASSWORD
    delete process.env.MOCHA_ACCESS_ACCT_ID
    delete process.env.MOCHA_ACCESS_TOKEN
    delete process.env.MOCHA_ACTIVATION_TOKEN
  })
})
