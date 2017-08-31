#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the root route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require('supertest')
const server = supertest('http://localhost:1138')

describe(`GET / (the root route at '/' redirects to '/root')`, () =>
  it(`should respond with type json, status 200, body.status 'success',
      body.message 'This is the http://www.Recipe.Report API server.', and
      body.json property 'headers'`,
    async () => {
      const res = await server.get(`/root`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`This is the http://www.Recipe.Report API server.`)
      res.body.json.should.have.property(`headers`)
    }
  )
)
