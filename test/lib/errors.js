#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the error handling middleware for expressjs.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const errors = require(`../../lib/errors`)

describe(`Error handling middleware for expressjs.`, () => {
  it(`should respond with status 404, and text 'four, oh four!'`,
    () => {
      let res = {
        status (status) { this.status = status; return this },
        send (text) { this.text = text }
      }
      errors.handle404({}, res)
      res.status.should.equal(404)
      res.text.should.equal(`four, oh four!`)
    }
  )
  it(`should respond with status 500, and text 'five hundred! PurposefulError'`,
    () => {
      let error = new Error(`Unit test error.`)
      error.name = `UnitTestError`
      let res = {
        status (status) { this.status = status; return this },
        send (text) { this.text = text }
      }
      errors.handle500(error, {}, res)
      res.status.should.equal(500)
      res.text.should.equal(`five hundred! ${error.name}`)
    }
  )
})
