#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the account-login route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require('supertest')
const server = supertest('http://localhost:1138')
const token = require('../../lib/token')
const util = require('util')

describe(`POST /login (account login)`, () => {
  it(`should respond with JSON, status 200, body.status of 'success',
      body.message of 'Authentication successful.', body.json property
      'token', and the decoded token payload.type of 'access', when
      request sends existing account email and password.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`Authentication successful.`)
      res.body.json.should.have.property(`token`)
      const decoded = await token.decode(process.env.MOCHA_ACCESS_TOKEN)
      decoded.payload.type.should.equal(`access`)
      // Save the token as an env var for a future test.
      process.env.MOCHA_ACCESS_TOKEN = res.body.json.token
    }
  )
  it(`should respond with status 401 Unauthorized when request sends existing
      account email and an incorrect password.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.MOCHA_USERNAME,
          password: `wrongPassword`
        })
      res.status.should.equal(401)
    }
  )
  it(`should respond with status 401 Unauthorized when request sends existing
      account email and password correct but too quickly after previous attempt.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
      res.status.should.equal(401)
    }
  )
  it(`should wait more than 100 milliseconds before next login attempt.`,
    async () => {
      const setTimeoutPromise = util.promisify(setTimeout)
      await setTimeoutPromise(101)
    }
  )
  // Try logging in, again.
  it(`should respond with JSON, status 200, body.status of 'success',
      body.message of 'Authentication successful.', and body.json property of
      'token', when request sends existing account email and password
      (this is after an initial login success, then some failed attempts).`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`Authentication successful.`)
      res.body.json.should.have.property(`token`)
    }
  )
  it(`should respond with status 401 Unauthorized when request sends an unknown
      email and an existing account password.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: `unknownEmail@recipe.report`,
          password: process.env.MOCHA_PASSWORD
        })
      res.status.should.equal(401)
    }
  )
  it(`should respond with status 400 Bad Request when request sends existing
      account email and an empty password.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: process.env.MOCHA_USERNAME,
          password: ``
        })
      res.status.should.equal(400)
    }
  )
  it(`should respond with status 400 Bad Request when request sends empty email
      and existing account password.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: ``,
          password: process.env.MOCHA_PASSWORD
        })
      res.status.should.equal(400)
    }
  )
  it(`should respond with status 400 Bad Request when request sends empty email
      and empty password.`,
    async () => {
      const res = await server.post(`/login`)
        .set(`Content-Type`, `application/json`)
        .send({
          email: ``,
          password: ``
        })
      res.status.should.equal(400)
    }
  )
  it(`should respond with status 400 Bad Request when request sends nothing.`,
    async () => {
      const res = await server.post(`/login`)
      res.status.should.equal(400)
    }
  )
})
