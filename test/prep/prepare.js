#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test that prepares for the remaining unit tests.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Prepare for unit testing.
 */
before(done => {
  // Set the sendmail development port and host.
  process.env.SENDMAIL_DEV_PORT = 1025
  process.env.SENDMAIL_DEV_HOST = `localhost`
  // Start the development smtp email server
  // MailDev WebApp running at http://localhost:1080
  // MailDev SMTP Server running at localhost:1025
  const MailDev = require(`maildev`)
  const maildev = new MailDev({
    silent: true,
    disableWeb: false
  })
  maildev.listen()
  done()
})

describe(`Preparing to run unit tests.`, () => {
  it(`should find that NODE_ENV has been set to test.`,
    () => process.env.NODE_ENV.should.equal(`test`)
  )
})
