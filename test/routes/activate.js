#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the activation route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require('supertest')
const server = supertest('http://localhost:1138')

describe('POST /register/:token (user account activation)', () => {
  it(`should respond with JSON, status 200, res.body.status of 'success',
      and res.body.message of 'Activation successful.', when request includes
      a valid activation token in the URL.`,
    () =>
      server.get(`/register/${process.env.MOCHA_ACTIVATION_TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('success')
          res.body.message.should.equal('Activation successful.')
        })
  )
})
