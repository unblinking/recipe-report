#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of a fatal error during app.js startup.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const datastores = require(`../../lib/datastores`)
const mongo = require(`mongoose`)
const mute = require(`mute`)
const util = require(`util`)

const setTimeoutPromise = util.promisify(setTimeout)

describe(`App.js (the main app script)`, () => {
  before(async () => {
    await datastores.disconnect()
    mongo.connection.readyState.should.equal(0) // readyState of 0 (disconnected)
  })
  it(`should cause a fatal error when env vars are not set.`,
    async () => {
      const exit = process.exit
      process.exit = () => { process.env.FATAL_APP_TEST = `exited` }
      let unmute = mute() // Begin muting stdout and stderr.
      const fatalApp = require(`../../app`)
      fatalApp.main()
      await setTimeoutPromise(100) // Wait for the app to error.
      process.env.FATAL_APP_TEST.should.equal(`exited`)
      unmute() // Stop muting stdout and stderr.
      process.exit = exit // Reset process.exit as it was.
      // Delete the require.cache instance for the app, so that it may be
      // required again fresh in the next test.
      delete require.cache[require.resolve(`../../app`)]
      delete process.env.FATAL_APP_TEST
    }
  )
  it(`should start the app successfully.`,
    async () => {
      process.env.MONGODB_URI = `mongodb://127.0.0.1/test`
      process.env.PORT = 1138
      process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
      process.env.JWT_SECRET = `devTestEnvironment`
      process.env.JWT_ALGORITHM = `HS256`
      let unmute = mute() // Begin muting stdout and stderr.
      const app = require(`../../app`)
      app.main()
      await setTimeoutPromise(2000) // Wait 2 seconds for the app to finish starting.
      unmute() // Stop muting stdout and stderr.
    }
  )
})
