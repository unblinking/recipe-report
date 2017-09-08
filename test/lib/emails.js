#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the email wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const checkEmail = require(`../../lib/emails`).check
const renderEmail = require(`../../lib/emails`).render
const sendEmail = require(`../../lib/emails`).send

describe(`Email operations`, () => {
  it(`should check an email address and return it when it seems valid.
      seeminglyvalid@recipe.report`,
    async () => {
      const email = `seeminglyvalid@recipe.report`
      const result = await checkEmail(email)
      result.should.equal(email)
    }
  )
  it(`should check and email address and error when it seems invalid.
      @recipe.report`,
    async () => {
      try {
        const email = `@recipe.report`
        await checkEmail(email)
      } catch (error) {
        error.name.should.equal(`SeeminglyInvalidEmailError`)
        error.message.should.equal(`Email address seems invalid.`)
      }
    }
  )
  it(`should check and email address and error when it seems invalid.
      seeminglyinvalid@recipe`,
    async () => {
      try {
        const email = `seeminglyinvalid@recipe`
        await checkEmail(email)
      } catch (error) {
        error.name.should.equal(`SeeminglyInvalidEmailError`)
        error.message.should.equal(`Email address seems invalid.`)
      }
    }
  )
  it(`should check and email address and error when it seems invalid.
      seeminglyinvalid@`,
    async () => {
      try {
        const email = `seeminglyinvalid@`
        await checkEmail(email)
      } catch (error) {
        error.name.should.equal(`SeeminglyInvalidEmailError`)
        error.message.should.equal(`Email address seems invalid.`)
      }
    }
  )
  it(`should render email fields 'from', 'subject', and 'text' when an email
      address and activation token are provided.`,
    async () => {
      const email = `seeminglyvalid@recipe.report`
      const token = `123`
      const fields = await renderEmail(email, token)
      fields.from.should.equal(`no-reply@recipe.report`)
      fields.subject.should.equal(`Recipe.Report Account Activation Required`)
      fields.text.should.not.equal(undefined)
    }
  )
  it(`should not render email fields when an email address is not provided.`,
    async () => {
      try {
        const email = undefined
        const token = `123`
        await renderEmail(email, token)
      } catch (error) {
        error.name.should.equal(`EmailRenderError`)
        error.message.should.equal(`Email address or token is missing.`)
      }
    }
  )
  it(`should not render email fields when a token is not provided.`,
    async () => {
      try {
        const email = `seeminglyvalid@recipe.report`
        const token = undefined
        await renderEmail(email, token)
      } catch (error) {
        error.name.should.equal(`EmailRenderError`)
        error.message.should.equal(`Email address or token is missing.`)
      }
    }
  )
  it(`should send email when 'from', 'to', 'subject', and 'text' are provided.`,
    async () => {
      const from = `no-reply@recipe.report`
      const to = `unitTesting@recipe.report`
      const subject = `Unit test sending email.`
      const text = `This is a unit test email.`
      const reply = await sendEmail(from, to, subject, text)
      reply.should.equal(`221 Bye\r\n`)
      process.env.TEST_EMAIL_SENT_TEXT.should.equal(`This is a unit test email.\n\n`)
      process.env.TEST_EMAIL_SENT_SUBJECT.should.equal(`Unit test sending email.`)
      process.env.TEST_EMAIL_SENT_FROM.should.equal(`no-reply@recipe.report`)
      process.env.TEST_EMAIL_SENT_TO.should.equal(`unitTesting@recipe.report`)
    }
  )
  it(`should not send email when 'from' is not provided.`,
    async () => {
      try {
        const from = undefined
        const to = `unitTesting@recipe.report`
        const subject = `Unit test sending email.`
        const text = `This is a unit test email.`
        await sendEmail(from, to, subject, text)
      } catch (error) {
        error.name.should.equal(`EmailSendError`)
        error.message.should.equal(`From, To, Subject, or Text is missing.`)
      }
    }
  )
  it(`should not send email when 'from' is not a valid email address.`,
    async () => {
      try {
        const from = `invalid`
        const to = `unitTesting@recipe.report`
        const subject = `Unit test sending email.`
        const text = `This is a unit test email.`
        await sendEmail(from, to, subject, text)
      } catch (error) {
        error.name.should.equal(`Error`)
        error.message.should.equal(`SMTP code:501 msg:501 Error: Bad sender address syntax\r\n`)
      }
    }
  )
  it(`should not send email when 'to' is not a valid email address.`,
    async () => {
      try {
        const from = `no-reply@recipe.report`
        const to = `invalid`
        const subject = `Unit test sending email.`
        const text = `This is a unit test email.`
        await sendEmail(from, to, subject, text)
      } catch (error) {
        error.name.should.equal(`Error`)
        error.message.should.equal(`SMTP code:501 msg:501 Error: Bad recipient address syntax\r\n`)
      }
    }
  )
  after(() => {
    // Clean up the used environmental variables.
    delete process.env.TEST_EMAIL_SENT_TEXT
    delete process.env.TEST_EMAIL_SENT_SUBJECT
    delete process.env.TEST_EMAIL_SENT_FROM
    delete process.env.TEST_EMAIL_SENT_TO
  })
})
