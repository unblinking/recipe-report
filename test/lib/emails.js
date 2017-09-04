#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the email wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const emails = require(`../../lib/emails`)

describe(`Email wrapper functions.`, () => {
  it(`should render fiends 'from', 'subject', and 'text' when an email
      address and activation token are provided.`,
    async () => {
      const email = `useremailaddress@recipe.report`
      const token = `123`
      const fields = await emails.render(email, token)
      fields.from.should.equal(`no-reply@recipe.report`)
      fields.subject.should.equal(`Recipe.Report Account Activation Required`)
      fields.text.should.not.equal(undefined)
    }
  )

  it(`should fail to render fields when email is not provided.`,
    async () => {
      try {
        const email = undefined
        const token = `123`
        await emails.render(email, token)
      } catch (error) {
        error.name.should.equal(`EmailRenderError`)
        error.message.should.equal(`Email address or token is missing.`)
      }
    }
  )
})
