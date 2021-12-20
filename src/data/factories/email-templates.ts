/**
 * Email constants.
 *
 * Short strings, and string literal templates, for email subjects and bodies.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/api.recipe.report}
 *
 * Recipe.Report API Server is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report API Server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import { IUserModel } from 'domain/models/user-model'

const getProtocol = (): string => {
  let protocol = `http`
  if (process.env.NODE_ENV === 'production') {
    protocol = `https`
  }
  return protocol
}

const getHostname = (): string => {
  let hostname = `localhost:1138`
  if (process.env.NODE_ENV === 'production') {
    hostname = `api.recipe.report`
  }
  return hostname
}

export const noReplyAddress = `no-reply@recipe.report`
export const subjectActivation = `Recipe.Report new user account activation required.`

/**
 * New user activation body template.
 * @param toEmailAddress The new registered user's email address.
 * @param token An excrypted/encoded JSON web token.
 */
export const bodyActivationTemplate = (
  user: IUserModel,
  token: string,
): string => {
  return `
Hello ${user.email_address},

Thank you for registering with Recipe.Report recently. You may login after completing activation. Please follow the link below to activate your new account. The link will expire in 24 hours.

${getProtocol()}://${getHostname()}/v1/user/activation/${token}

You received this email because you (or someone else) used this email address to create a new account.

Thank you,

http://www.Recipe.Report

`
}
