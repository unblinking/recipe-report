#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the error handling for expressjs.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const supertest = require('supertest')
const server = supertest('http://localhost:1138')

describe(`Error handling for expressjs.`, () => {
  it(`should respond with status 404, and text 'four, oh four!'`,
    async () => {
      const res = await server.get(`/nonexisting`)
      res.status.should.equal(404)
      res.text.should.equal(`four, oh four!`)
    }
  )
  it(`should respond with status 500, and text 'five hundred! PurposefulError'`,
    async () => {
      const res = await server.get(`/test/throws`)
      res.status.should.equal(500)
      res.text.should.equal(`five hundred! PurposefulError`)
    }
  )
})
