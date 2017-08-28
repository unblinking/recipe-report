#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the account-login route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require('supertest')
const server = supertest('http://localhost:1138')
const util = require('util')

describe('POST /login (user account login)', () => {
  it(`should respond with JSON, status 200, res.body.status of 'success',
      res.body.message of 'Authentication successful.', and a token in
      res.body.json.token when request sends existing user email and password.`,
    () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('success')
          res.body.message.should.equal('Authentication successful.')
          res.body.json.should.have.property('token')
          // Save the token for the next test.
          process.env.MOCHA_LOGIN_TOKEN = res.body.json.token
        })
  )
  it(`should respond with status 401 Unauthorized when request sends existing
      user email and an incorrect password.`, () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: 'wrongPassword'
        })
        .expect(401)
  )
  it(`should respond with status 401 Unauthorized when request sends existing
      user email and password correct but too quickly after previous attempt.`,
    () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
        .expect(401)
  )
  it(`should wait more than 100 milliseconds before next login attempt.`,
    async () => {
      const setTimeoutPromise = util.promisify(setTimeout)
      await setTimeoutPromise(101)
    }
  )
  // Try logging in, again.
  it(`should respond with JSON, status 200, res.body.status of 'success',
      res.body.message of 'Authentication successful.', and a token in
      res.body.json.token when request sends existing user email and password.`,
    () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('success')
          res.body.message.should.equal('Authentication successful.')
          res.body.json.should.have.property('token')
          // Save the token for the next test.
          process.env.MOCHA_TOKEN = res.body.json.token
        })
  )
  it(`should respond with status 401 Unauthorized when request sends an unknown
      email and an existing user password.`, () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'unknownEmail@recipe.report',
          password: process.env.MOCHA_PASSWORD
        })
        .expect(401)
  )
  it(`should respond with status 400 Bad Request when request sends existing
      user email and an empty password.`, () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: ''
        })
        .expect(400)
  )
  it(`should respond with status 400 Bad Request when request sends empty email
      and existing user password.`, () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: '',
          password: process.env.MOCHA_PASSWORD
        })
        .expect(400)
  )
  it(`should respond with status 400 Bad Request when request sends empty email
      and empty password.`, () =>
      server.post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: '',
          password: ''
        })
        .expect(400)
  )
  it(`should respond with status 400 Bad Request when request sends nothing.`,
    () =>
      server.post('/login')
        .expect(400)
  )
})
