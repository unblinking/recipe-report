#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the activation route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const Account = require('../../models/account')
const accounts = require('../../lib/accounts')
const supertest = require('supertest')
const server = supertest('http://localhost:1138')
const tokens = require('../../lib/tokens')

describe('POST /register/:token (account activation)', () => {
  before(async () => {
    process.env.TEST_ACCOUNT_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
    const email = process.env.TEST_ACCOUNT_USERNAME
    process.env.TEST_ACCOUNT_PASSWORD = new Date().getTime()
    const password = process.env.TEST_ACCOUNT_PASSWORD
    const account = await accounts.create(email, password)
    process.env.TEST_ACTIVATION_TOKEN = await tokens.sign(account, { type: 'activation' })
    process.env.TEST_ACCESS_TOKEN = await tokens.sign(account, { type: 'access' })
  })
  it('should respond with JSON, status 200, body.status of \'success\', and body.message of \'Activation successful.\', when request includes a valid activation token for a valid account in the URL.',
    async () => {
      const token = process.env.TEST_ACTIVATION_TOKEN
      const res = await server.get(`/register/${token}`)
      res.type.should.equal('application/json')
      res.status.should.equal(200)
      res.body.status.should.equal('success')
      res.body.message.should.equal('Activation successful.')
    }
  )
  it('should respond with JSON, status 200, body.status of \'error\', body.message of \'Activation successful.\', and body.json.name of \'RegistrationActivationError\' when request includes an access token in the URL instead of an activation token.',
    async () => {
      const token = process.env.TEST_ACCESS_TOKEN
      const res = await server.get(`/register/${token}`)
      res.type.should.equal('application/json')
      res.status.should.equal(200)
      res.body.status.should.equal('error')
      res.body.message.should.equal('Token type not activation.')
      res.body.json.name.should.equal('RegistrationActivationError')
    }
  )
  it('should respond with JSON, status 200, body.status of \'error\', body.message of \'Account not found.\', and body.json.name of \'RegistrationActivationError\' when request includes an access token that contains an invalid account ID.',
    async () => {
      // Create an account model that has an _id but isn't in the datastore.
      const account = new Account({
        email: process.env.TEST_ACCOUNT_USERNAME
      })
      account._id = '000000000000000000000000'
      const token = await tokens.sign(account, { type: 'activation' })
      const res = await server.get(`/register/${token}`)
      res.type.should.equal('application/json')
      res.status.should.equal(200)
      res.body.status.should.equal('error')
      res.body.message.should.equal('Account not found.')
      res.body.json.name.should.equal('RegistrationActivationError')
    }
  )
  after(() => {
    // Clean up the required environmental variables.
    delete process.env.TEST_ACCOUNT_USERNAME
    delete process.env.TEST_ACCOUNT_PASSWORD
    delete process.env.TEST_ACTIVATION_TOKEN
    delete process.env.TEST_ACCESS_TOKEN
  })
})
