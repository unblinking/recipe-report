#!/usr/bin/env node

'use strict'

/**
 * Unit test of the account-login route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Required modules.
 * @see {@link https://github.com/visionmedia/supertest supertest}
 */
const app = require('../../app')
const supertest = require('supertest')

/**
 * Tests.
 */
describe('POST /login (user account login)', () => {
  it(`should respond with JSON, status 200, res.body.status of 'success',
      res.body.message of 'Authentication successful.', and a token in
      res.body.json.token when request sends existing user email and password.`,
    () =>
      supertest(app)
        .post('/login')
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
  it(`should respond with status 401 Unauthorized when request sends existing
      user email and an incorrect password.`, () =>
      supertest(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: 'wrongPassword'
        })
        .expect(401)
  )
  it(`should respond with status 401 Unauthorized when request sends an unknown
      email and an existing user password.`, () =>
      supertest(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'unknownEmail@grocereport.com',
          password: process.env.MOCHA_PASSWORD
        })
        .expect(401)
  )
  it(`should respond with status 400 Bad Request when request sends existing
      user email and an empty password.`, () =>
      supertest(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: ''
        })
        .expect(400)
  )
  it(`should respond with status 400 Bad Request when request sends empty email
      and existing user password.`, () =>
      supertest(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: '',
          password: process.env.MOCHA_PASSWORD
        })
        .expect(400)
  )
  it(`should respond with status 400 Bad Request when request sends empty email
      and empty password.`, () =>
      supertest(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          email: '',
          password: ''
        })
        .expect(400)
  )
  it(`should respond with status 400 Bad Request when request sends nothing.`,
    () =>
      supertest(app)
        .post('/login')
        .expect(400)
  )
})
