'use strict'

/**
 * Starts the Recipe.Report API server in development mode.
 */

const app = require(`./app`)
const MailDev = require(`maildev`)

// Basic required environment variables
process.env.MONGODB_URI=`mongodb://127.0.0.1/test`
process.env.PORT=`1138`
process.env.CRYPTO_KEY = `MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT`
process.env.JWT_SECRET = `devTestEnvironment`
process.env.JWT_ALGORITHM = `HS256`

// Start the maildev test smtp email server
// MailDev WebApp running at http://localhost:1080
// MailDev SMTP Server running at localhost:1025
const maildev = new MailDev({
  smtp: 1025,
  outgoingHost: `localhost`,
  silent: true,
  disableWeb: false
})
maildev.listen()
maildev.on(`new`, email => {
  process.env.TEST_EMAIL_SENT_TEXT = email.text
  process.env.TEST_EMAIL_SENT_SUBJECT = email.subject
  process.env.TEST_EMAIL_SENT_FROM = email.from[0].address
  process.env.TEST_EMAIL_SENT_TO = email.to[0].address
})

// Configure sendmail to use our test smtp email server port and host.
process.env.SENDMAIL_DEV_PORT = 1025
process.env.SENDMAIL_DEV_HOST = `localhost`

app.main()
