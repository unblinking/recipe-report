#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of a fatal error during app.js startup.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const intercept = require(`intercept-stdout`)
const util = require(`util`)

describe(`App.js startup tests.`, () => {
  it(`should cause a fatal error when MongoDB connection fails.`,
    async () => {
      process.env.MONGODB_URI = `mongodb://` // Missing URI hostname on purpose.
      const exit = process.exit
      process.exit = () => { process.env.FATAL_ERROR_TEST = `exited` }
      let unhook = intercept(txt => { return `` }) // Begin muting stdout.
      const fatalApp = require(`../../app`)
      fatalApp.main()
      process.env.FATAL_ERROR_TEST.should.equal(`exited`)
      unhook() // Stop muting stdout.
      process.exit = exit // Reset process.exit as it was.
      // Delete the require.cache instance for the app, so that it may be
      // required again fresh in the next test.
      delete require.cache[require.resolve(`../../app`)]
    }
  )
  it(`should start the app successfully.`,
    async () => {
      process.env.MONGODB_URI = `mongodb://127.0.0.1/test`
      const app = require(`../../app`)
      app.main()
    }
  )
  it(`should wait a few seconds for the app to finish starting.`,
    async () => {
      const setTimeoutPromise = util.promisify(setTimeout)
      await setTimeoutPromise(5000) // Wait 2 seconds for the app to finish starting.
    }
  )
})
