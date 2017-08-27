#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the account-registration route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Required modules.
 * @see {@link https://github.com/visionmedia/supertest supertest}
 */
const supertest = require('supertest')
const server = supertest('http://localhost:1138')

/**
 * Tests.
 */
describe('POST /register (new account registration)', () => {
  it(`should respond with json, status 200, res.body.status of 'success', and
      res.body.message of 'Registration successful' when request sends a new
      user email and a password.`, () =>
      server.post('/register')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('success')
          res.body.message.should.equal('Registration successful')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error', and
      res.body.message of 'A user with the given username is already registered'
      when request sends a previously used email and a password.`, () =>
      server.post('/register')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('A user with the given username is already registered')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error', and
      res.body.message of 'No password was given' when request sends an email
      but no password.`, () =>
      server.post('/register')
        .set('Content-Type', 'application/json')
        .send({
          email: new Date().getTime() + '@recipe.report'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('No password was given')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error', and
      res.body.message of 'Email address seems invalid.' when request sends no
      email.`, () =>
      server.post('/register')
        .set('Content-Type', 'application/json')
        .send({
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('Email address seems invalid.')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error', and
      res.body.message of 'Email address seems invalid.' when request sends an
      invalid email.`, () =>
      server.post('/register')
        .set('Content-Type', 'application/json')
        .send({
          email: 'invalidEmail',
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('Email address seems invalid.')
        })
  )
})
