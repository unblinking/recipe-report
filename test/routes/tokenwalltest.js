#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the token-validation-test route of the API.
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
describe('GET /tokenwalltest (token authentication test)', () => {
  it(`should respond with json, status 200, res.body.status of 'success', and
      res.body.message of 'Welcome to the team, DZ-015.' when request sends a
      valid authentication token in the header.`, () =>
      server.get('/tokenwalltest')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('token', process.env.MOCHA_LOGIN_TOKEN)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('success')
          res.body.message.should.equal('Welcome to the team, DZ-015.')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error',
      res.body.message of 'jwt malformed', and res.body.json.name of
      JsonWebTokenError when request sends an invalid authentication token in
      the header.`, () =>
      server.get('/test')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('token', 'invalidAuthenticationToken')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('jwt malformed')
          res.body.json.name.should.equal('JsonWebTokenError')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error',
      res.body.message of 'jwt must be provided', and res.body.json.name of
      JsonWebTokenError when request sends an empty authentication token in
      the header.`, () =>
      server.get('/test')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('token', '')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('jwt must be provided')
          res.body.json.name.should.equal('JsonWebTokenError')
        })
  )
  it(`should respond with json, status 200, res.body.status of 'error',
      res.body.message of 'Unauthorized.', and res.body.json.name of Error when
      request does not send any token in the header.`,
    () =>
      server.get('/test')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('error')
          res.body.message.should.equal('Unauthorized.')
          res.body.json.name.should.equal('Error')
        })
  )
})
