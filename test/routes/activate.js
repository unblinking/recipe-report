#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the activation route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const AccountModel = require('../../models/account')
const supertest = require('supertest')
const server = supertest('http://localhost:1138')
const token = require('../../lib/token')

describe(`POST /register/:token (account activation)`, () => {
  it(`should use a token with the type of 'activation'.`,
    async () => {
      const decoded = await token.decode(process.env.MOCHA_ACTIVATION_TOKEN)
      decoded.payload.type.should.equal(`activation`)
    }
  )
  it(`should respond with JSON, status 200, body.status of 'success', and
      body.message of 'Activation successful.', when request includes a valid
      activation token for a valid account in the URL.`,
    async () => {
      const Token = process.env.MOCHA_ACTIVATION_TOKEN
      const res = await server.get(`/register/${Token}`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`Activation successful.`)
    }
  )
  it(`should create an access token for the next test.`,
    async () => {
      const Account = new AccountModel({
        email: process.env.MOCHA_USERNAME
      })
      const Token = await token.sign(Account, { type: `access` })
      process.env.MOCHA_ACCESS_TOKEN = Token
    })
  it(`should respond with JSON, status 200, body.status of 'error', and
      body.message of 'Activation successful.', when request includes an access
      token in the URL instead of an activation token.`,
    async () => {
      const Token = process.env.MOCHA_ACCESS_TOKEN
      const res = await server.get(`/register/${Token}`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Token type not activation.`)
      res.body.json.name.should.equal(`RegistrationActivationError`)
    }
  )
})
