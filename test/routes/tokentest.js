#!/usr/bin/env node

'use strict'

/**
 * Unit test of the token-validation-test route of the API.
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
describe('GET /tokentest (token authentication test)', () => {
  it(`should respond with json, status 200, res.body.status of 'success', and
      res.body.message of 'Welcome to the team, DZ-015.' when request sends a
      valid authentication token in the header.`, () =>
      supertest(app)
        .get('/tokentest')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('token', process.env.MOCHA_TOKEN)
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
      supertest(app)
        .get('/test')
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
      supertest(app)
        .get('/test')
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
      supertest(app)
        .get('/test')
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
