#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test to prepare for unit tests.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

before(done => {
  // Test values for environmental variables.
  process.env.MONGODB_URI = 'mongodb://127.0.0.1/test'
  process.env.PORT = 1138
  process.env.CRYPTO_KEY = 'MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT'
  process.env.JWT_SECRET = 'devTestEnvironment'
  process.env.JWT_ALGORITHM = 'HS256'
  // Create a username and password, stored as env vars for the tests to share.
  // Username: Needs to be unique. The username includes uppercase letters here
  // because passport-local-mongoose is setup to convert the username to
  // lowercase and we will test that later.
  // Password: Nothing special.
  process.env.MOCHA_USERNAME = new Date().getTime() + '@Recipe.Report'
  process.env.MOCHA_PASSWORD = new Date().getTime()
  // Start up the app.
  require('../app')
  // Wait a few seconds so that the app has time to start before the unit tests.
  setTimeout(() => { console.log(''); done() }, 3000)
})

/**
 * Tests.
 */
describe('Preparing to run unit tests.', () => {
  it(`should find that NODE_ENV has been set to test.`, () =>
    Promise.resolve(process.env.NODE_ENV)
      .then(nodeEnv => nodeEnv.should.equal('test'))
  )
})
