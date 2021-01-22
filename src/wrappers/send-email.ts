/**
 * Send email.
 * A basic wrapper around sendmail.
 * @see {@link https://github.com/guileen/node-sendmail sendmail}
 */

/* eslint-disable @typescript-eslint/no-var-requires */

export const sendmail = require('sendmail')({
  silent: true,
  devPort: process.env.SENDMAIL_DEV_PORT,
  devHost: process.env.SENDMAIL_DEV_HOST,
})
