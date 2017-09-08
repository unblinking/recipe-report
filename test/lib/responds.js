#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the response wrapper functions for expressjs.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const responds = require(`../../lib/responds`)

describe(`Expressjs response wrapper functions`, () => {
  it(`should respond with an unknown error message when no error is provided.`,
    () => {
      let res = {
        status (status) { this.status = status; return this },
        json (body) { this.body = body; return this }
      }
      responds.error(res)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Unknown error.`)
      res.body.json.name.should.equal(`UnknownError`)
    }
  )
  it(`should respond with an specific error message when that error is provided.`,
    () => {
      let res = {
        status (status) { this.status = status; return this },
        json (body) { this.body = body; return this }
      }
      let err = new Error(`Specific error.`)
      err.name = `SpecificError`
      responds.error(res, err)
      res.status.should.equal(200)
      res.body.status.should.equal(`error`)
      res.body.message.should.equal(`Specific error.`)
      res.body.json.name.should.equal(`SpecificError`)
    }
  )
  it(`should respond with a success message and provided message and json.`,
    () => {
      let res = {
        status (status) { this.status = status; return this },
        json (body) { this.body = body; return this }
      }
      let message = `Test message.`
      let json = { testKey: `testValue` }
      responds.success(res, message, json)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
      res.body.message.should.equal(`Test message.`)
      res.body.json.testKey.should.equal(`testValue`)
    }
  )
  it(`should respond with a success message without a message or json provided.`,
    () => {
      let res = {
        status (status) { this.status = status; return this },
        json (body) { this.body = body; return this }
      }
      responds.success(res)
      res.status.should.equal(200)
      res.body.status.should.equal(`success`)
    }
  )
})
