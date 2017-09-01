#!/usr/bin/env node

'use strict'

/**
 * String literal templates.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const emailActivation = (email, token) => {
  return (`
Hello ${email},

Thank you for registering with Recipe.Report recently. You may login after completing activation. Please follow this link to activate your new account:

https://api.recipe.report/register/${token}

You received this email because you (or someone else) used this email address to create a new account.

Thank you,

http://www.Recipe.Report
  `)
}

module.exports = {
  emailActivation: emailActivation
}
