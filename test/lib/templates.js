#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of template functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const templates = require('../../lib/templates')

describe('Templates', () => {
  it('should return an account activation email template with the provided token in the form of a link.',
    () => {
      const email = 'seeminglyvalid@recipe.report'
      const token = '123456'
      const template = templates.activation(email, token)
      const regex = /\bapi.recipe.report\/register\/(\S+)/
      template.match(regex)[1].should.equal(token)
    }
  )
})