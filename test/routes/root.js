#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the root route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require(`supertest`)
const server = supertest(`http://localhost:1138`)

describe(`GET / (the root route)`, () => {
  it(`should redirect '/' to '/root'`,
    async () => {
      const res = await server.get(`/`)
      res.text.should.equal(`Found. Redirecting to /root`)
    }
  )
  it(`should respond with type json, status 200, body.status 'success',
      body.message 'Welcome to the Recipe.Report API server.', and
      body.json property 'headers'`,
    async () => {
      const res = await server.get(`/root`)
      res.type.should.equal(`application/json`)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`Welcome to the Recipe.Report API server.`)
      res.body.json.should.have.property(`headers`)
    }
  )
})
