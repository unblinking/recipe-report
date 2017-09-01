#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test that prepares for the remaining unit tests.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const MailDev = require('maildev')

/**
 * Prepare for unit testing.
 * Set environmental variable values for test.
 * Username: Needs to be unique. The username includes mixed-case letters here
 *           because passport-local-mongoose is setup to convert the username to
 *           lowercase and we will test that later.
 * Password: Nothing special required yet.
 * Start the development smtp email server
 * Start the application.
 * Wait a moment so everything has time to start before the unit tests begin.
 */
before(done => {
  process.env.MONGODB_URI = `mongodb://127.0.0.1/test`
  process.env.PORT = 1138
  process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
  process.env.JWT_SECRET = `devTestEnvironment`
  process.env.JWT_ALGORITHM = `HS256`
  process.env.MOCHA_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
  process.env.MOCHA_PASSWORD = `password${new Date().getTime()}`
  process.env.SENDMAIL_DEV_PORT = 1025
  process.env.SENDMAIL_DEV_HOST = `localhost`
  const maildev = new MailDev({
    silent: true,
    disableWeb: true
  })
  // MailDev WebApp running at http://localhost:1080
  // MailDev SMTP Server running at localhost:1025
  maildev.listen()
  maildev.on(`new`, email => {
    const regex = /\bapi.recipe.report\/register\/(\S+)/
    process.env.MOCHA_ACTIVATION_TOKEN = email.text.match(regex)[1]
  })
  require('../app')
  setTimeout(() => { console.log(``); done() }, 3000)
})

describe(`Preparing to run unit tests.`, () => {
  it(`should find that NODE_ENV has been set to test.`,
    () => process.env.NODE_ENV.should.equal(`test`)
  )
})
