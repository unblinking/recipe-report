#!/usr/bin/env node

'use strict'

/**
 * Email functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const sendmail = require('sendmail')({
  silent: true,
  devPort: process.env.SENDMAIL_DEV_PORT,
  devHost: process.env.SENDMAIL_DEV_HOST
})
const templates = require('./templates')

function check (email) {
  return new Promise((resolve, reject) => {
    // A regular expression to do a quick sanity-check.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(email)) {
      let emailError = new Error(`Email address seems invalid.`)
      emailError.name = `SeeminglyInvalidEmailError`
      reject(emailError)
    } else {
      resolve()
    }
  })
}

function render (email, token) {
  return new Promise((resolve, reject) => {
    if (email === undefined || token === undefined) {
      let emailError = new Error(`Email address or token is missing.`)
      emailError.name = `EmailRenderError`
      reject(emailError)
    }
    const from = `no-reply@recipe.report`
    const subject = `Welcome to www.Recipe.Report - Activation is required`
    const text = templates.emailActivation(email, token)
    resolve({ from: from, subject: subject, text: text })
  })
}

function send (from, to, subject, text) {
  return new Promise((resolve, reject) => {
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
