#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test that prepares for the remaining unit tests.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Prepare for unit testing.
 * Set environmental variable values for test.
 * Username: Needs to be unique. The username includes uppercase letters here
 *           because passport-local-mongoose is setup to convert the username to
 *           lowercase and we will test that later.
 * Password: Nothing special required yet.
 * Start the application.
 * Wait a few seconds so that the app has time to start before the unit tests.
 */
before(done => {
  process.env.MONGODB_URI = `mongodb://127.0.0.1/test`
  process.env.PORT = 1138
  process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
  process.env.JWT_SECRET = `devTestEnvironment`
  process.env.JWT_ALGORITHM = `HS256`
  process.env.MOCHA_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
  process.env.MOCHA_PASSWORD = `password${new Date().getTime()}`
  require('../app')
  setTimeout(() => { console.log(``); done() }, 3000)
})

describe(`Preparing to run unit tests.`, () =>
  it(`should find that NODE_ENV has been set to test.`,
    () => process.env.NODE_ENV.should.equal(`test`)
  )
)
