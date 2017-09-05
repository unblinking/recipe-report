#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of template functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const templates = require(`../../lib/templates`)

describe(`Template functions.`, () => {
  it(`should return account activation email template with the provided token
      in the form of a link.`,
    () => {
      let email = `seeminglyvalid@recipe.report`
      let token = `123456`
      const rendered = templates.activation(email, token)
      const regex = /\bapi.recipe.report\/register\/(\S+)/
      const match = rendered.match(regex)
      match[1].should.equal(token)
    }
  )
})
