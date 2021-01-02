/**
 * Email constants.
 * Short strings, and string literal templates, for email subjects and bodies.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { IUserModel } from 'db/models/user-model'

export const noReplyAddress = `no-reply@recipe.report`

export const subjectActivation = `Recipe.Report new user account activation required.`

/**
 * New user activation body template.
 * @param toEmailAddress The new registered user's email address.
 * @param token An excrypted/encoded JSON web token.
 */
export const bodyActivationTemplate = (
  user: IUserModel,
  token: string
): string => {
  return `
Hello ${user.email_address},

Thank you for registering with Recipe.Report recently. You may login after completing activation. Please follow this link to activate your new account:

https://api.recipe.report/user/activate:${token}

You received this email because you (or someone else) used this email address to create a new account.

Thank you,

http://www.Recipe.Report

`
}
