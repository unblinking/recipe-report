#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the account-registration route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require('supertest')
const server = supertest('http://localhost:1138')

describe(`POST /register (new account registration)`, () => {
  before(() => {
    // Set the required environmental variables.
    process.env.TEST_ACCOUNT_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
    process.env.TEST_ACCOUNT_PASSWORD = new Date().getTime()
  })
  it(`should respond with type json, status 200, body.status of 'success',
      body.message of 'Registration successful.', body.json property 'token',
      and body.json.token is defined, when request sends a new account email and
      a password.`,
    async () => {
      const res = await server.post(`/register`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.TEST_ACCOUNT_USERNAME,
          password: process.env.TEST_ACCOUNT_PASSWORD
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`Registration successful.`)
    }
  )
  it(`should respond with type json, status 200, body.status of 'error',
      body.message of 'An account with the given email address is already
      registered.', and body.json.name of 'UserExistsError' when request sends
      a previously used email and a password.`,
    async () => {
      const res = await server.post(`/register`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.TEST_ACCOUNT_USERNAME,
          password: process.env.TEST_ACCOUNT_PASSWORD
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`An account with the given email address is already registered.`)
      res.body.json.name.should.equal(`UserExistsError`)
    }
  )
  it(`should respond with type json, status 200, body.status of 'error',
      body.message of 'No password was given.', and body.json.name of
      'MissingPasswordError' when request sends an email but no password.`,
    async () => {
      const res = await server.post(`/register`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: `${new Date().getTime()}@recipe.report`
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`No password was given.`)
      res.body.json.name.should.equal(`MissingPasswordError`)
    }
  )
  it(`should respond with type json, status 200, body.status of 'error',
      body.message of 'Email address seems invalid.', and body.json.name of
      'SeeminglyInvalidEmailError' when request sends no email and a valid
      password.`,
    async () => {
      const res = await server.post(`/register`)
        .set(`Content-Type`, `application/json`)
        .send({
          password: process.env.TEST_ACCOUNT_PASSWORD
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Email address seems invalid.`)
      res.body.json.name.should.equal(`SeeminglyInvalidEmailError`)
    }
  )
  it(`should respond with type json, status 200, body.status of 'error',
      body.message of 'Email address seems invalid.', and body.json.name of
      'SeeminglyInvalidEmailError' when request sends an invalid email and a
      valid password.`,
    async () => {
      const res = await server.post(`/register`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: `invalidEmail`,
          password: process.env.TEST_ACCOUNT_PASSWORD
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Email address seems invalid.`)
      res.body.json.name.should.equal(`SeeminglyInvalidEmailError`)
    }
  )
  after(() => {
    // Clean up the required environmental variables.
    delete process.env.TEST_ACCOUNT_USERNAME
    delete process.env.TEST_ACCOUNT_PASSWORD
  })
})
