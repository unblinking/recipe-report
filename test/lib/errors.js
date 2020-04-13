#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the error handling middleware for expressjs.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const errors = require('../../lib/errors')
const mute = require('mute')

describe('Error handling middleware for expressjs', () => {
  it('should respond with status 404, and text \'four, oh four!\'',
    () => {
      const res = {
        status (status) { this.status = status; return this },
        send (text) { this.text = text }
      }
      errors.handle404({}, res)
      res.status.should.equal(404)
      res.text.should.equal('four, oh four!')
    }
  )
  it('should respond with status 500, and text \'five hundred! PurposefulError\'',
    () => {
      const err = new Error('Unit test error.')
      err.name = 'UnitTestError'
      const res = {
        status (status) { this.status = status; return this },
        send (text) { this.text = text }
      }
      errors.handle500(err, {}, res)
      res.status.should.equal(500)
      res.text.should.equal(`five hundred! ${err.name}`)
    }
  )
  it('should handle a fatal error by calling process.exit().',
    async () => {
      const exit = process.exit
      process.exit = () => { process.env.FATAL_ERROR_TEST = 'exited' }
      const unmute = mute() // Begin muting stdout and stderr.
      const err = new Error('Unit test error.')
      err.name = 'UnitTestError'
      errors.handleFatal(err)
      process.env.FATAL_ERROR_TEST.should.equal('exited')
      unmute() // Stop muting stdout and stderr.
      process.exit = exit // Reset process.exit as it was.
      delete process.env.FATAL_ERROR_TEST
    }
  )
})
