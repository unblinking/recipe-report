#!/usr/bin/env node

'use strict'

/**
 * Email wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

function check (email) {
  return new Promise((resolve, reject) => {
    // A regular expression to do a quick sanity-check.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      let error = new Error(`Email address seems invalid.`)
      error.name = `SeeminglyInvalidEmailError`
      reject(error)
    } else {
      resolve()
    }
  })
}

function render (email, token) {
  return new Promise((resolve, reject) => {
    const templates = require(`./templates`)
    if (email === undefined || token === undefined) {
      let error = new Error(`Email address or token is missing.`)
      error.name = `EmailRenderError`
      reject(error)
    }
    const from = `no-reply@recipe.report`
    const subject = `Recipe.Report Account Activation Required`
    const text = templates.activation(email, token)
    resolve({ from: from, subject: subject, text: text })
  })
}

function send (from, to, subject, text) {
  return new Promise((resolve, reject) => {
    const sendmail = require(`sendmail`)({
      silent: true,
      devPort: process.env.SENDMAIL_DEV_PORT,
      devHost: process.env.SENDMAIL_DEV_HOST
    })
    sendmail({
      from: from,
      to: to,
      subject: subject,
      text: text
    }, (err, reply) => {
      if (err) reject(err)
      else resolve(reply)
    })
  })
}

module.exports = {
  check: check,
  render: render,
  send: send
}
