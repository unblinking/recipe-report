#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the token-validation-test route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const crypt = require('../../lib/crypt')
const supertest = require('supertest')
const server = supertest('http://localhost:1138')
const token = require('../../lib/token')

describe(`GET /tokenwalltest (token authentication test)`, () => {
  it(`should be using a token with payload.type of 'access'.`,
    async () => {
      const decoded = await token.decode(process.env.MOCHA_ACCESS_TOKEN)
      decoded.payload.type.should.equal(`access`)
      // Save the decrypted account ID for the next text.
      process.env.MOCHA_ACCESS_ACCT_ID = crypt.decrypt(decoded.payload.id.toString())
    }
  )
  it(`should respond with json, status 200, body.status of 'success', and
      body.message of 'Welcome to the team, DZ-015.', when request sends a
      valid access token in the header.`,
    async () => {
      const res = await server.get(`/tokenwalltest`)
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
      const res = await server.get(`/tokenwalltest`)
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
      const res = await server.get(`/tokenwalltest`)
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
      const res = await server.get(`/tokenwalltest`)
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
      const res = await server.get(`/tokenwalltest`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Error reading token.`)
      res.body.json.name.should.equal(`TokenVerifyError`)
    }
  )
})
