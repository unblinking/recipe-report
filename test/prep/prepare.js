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
  // Set environmental variable values for test.
  process.env.PORT = 1138
  process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
  process.env.JWT_SECRET = `devTestEnvironment`
  process.env.JWT_ALGORITHM = `HS256`
  // Username: Needs to be unique. The username includes mixed-case letters here
  // because passport-local-mongoose is setup to convert the username to
  // lowercase and we will test that later.
  process.env.MOCHA_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
  // Password: Nothing special required yet.
  process.env.MOCHA_PASSWORD = `password${new Date().getTime()}`
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
  maildev.on(`new`, email => {
    const regex = /\bapi.recipe.report\/register\/(\S+)/
    const match = email.text.match(regex)
    if (match !== null && match[1] !== undefined) {
      process.env.MOCHA_ACTIVATION_TOKEN = match[1]
    }
  })
  done()
})

describe(`Preparing to run unit tests.`, () => {
  it(`should find that NODE_ENV has been set to test.`,
    () => process.env.NODE_ENV.should.equal(`test`)
  )
})
