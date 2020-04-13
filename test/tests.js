#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit testing.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const MailDev = require('maildev')

describe('Unit testing', () => {
  before(() => {
    // Start the maildev test smtp email server
    // MailDev WebApp running at http://localhost:1080
    // MailDev SMTP Server running at localhost:1025
    const maildev = new MailDev({
      smtp: 1025,
      outgoingHost: 'localhost',
      silent: true,
      disableWeb: true
    })
    maildev.listen()
    maildev.on('new', email => {
      process.env.TEST_EMAIL_SENT_TEXT = email.text
      process.env.TEST_EMAIL_SENT_SUBJECT = email.subject
      process.env.TEST_EMAIL_SENT_FROM = email.from[0].address
      process.env.TEST_EMAIL_SENT_TO = email.to[0].address
    })
    // Configure sendmail to use our test smtp email server port and host.
    process.env.SENDMAIL_DEV_PORT = 1025
    process.env.SENDMAIL_DEV_HOST = 'localhost'
  })
  it('should find that NODE_ENV has been set to test.', () =>
    process.env.NODE_ENV.should.equal('test')
  )
  after(() => {
    // Unit tests in special order of execution.
    //
    // Test the scripts in /lib.
    // These are all written so that they could be run individually.
    require('./lib/accounts')
    require('./lib/crypts')
    require('./lib/datastores')
    require('./lib/emails')
    require('./lib/errors')
    require('./lib/funs')
    require('./lib/responds')
    require('./lib/templates')
    require('./lib/tokens')
    //
    // Start the expressjs app and test its routes.
    // The app test needs to be run first. It tests the app.js script and then
    // leaves the app running so that the route tests can hit it. The route tests
    // do not rely on each other, so they could be run individually as long as the
    // app is running
    require('./app/app')
    require('./routes/root')
    require('./routes/register')
    require('./routes/activate')
    require('./routes/login')
    require('./routes/test')
  })
})
