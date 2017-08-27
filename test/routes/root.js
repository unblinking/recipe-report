#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the root route of the API.
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
describe('GET / (the root route)', () =>
  it(`should respond with json, status 200, res.body.status of 'success', and
      res.body.message of 'This is the http://www.Recipe.Report API server.'`,
    () =>
      server.get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          res.body.status.should.equal('success')
          res.body.message.should.equal('This is the http://www.Recipe.Report API server.')
        })))
