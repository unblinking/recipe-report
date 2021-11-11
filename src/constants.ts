/**
 * Global constants.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * Based on an approach in an article titled "How to Share Constants in
 * Typescript Project" by Sunny Sun. 7/25/2021.
 * @see {@link https://medium.com/codex/how-to-share-constants-in-typescript-project-8f76a2e40352}
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

/**
 * HTTP response status codes.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
 */
export const httpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const
type httpStatusType = typeof httpStatus
export type httpStatusKeyType = keyof httpStatusType
export type httpStatusValueType = httpStatusType[keyof httpStatusType]

/**
 * Outcomes of service layer requests.
 */
export const outcomes = {
  SUCCESS: `success`,
  FAIL: `fail`,
  ERROR: `error`,
} as const
type outcomeType = typeof outcomes
export type outcomeKeyType = keyof outcomeType
export type outcomeValueType = outcomeType[keyof outcomeType]

/**
 * Error message base statements.
 */
const errBase = {
  REG: `The user couldn't be registered because`,
  ACTIVATE: `The user couldn't be activated because`,
  AUTH: `The user couldn't be authenticated because`,
}
/**
 * Error messages.
 */
export const errMessage = {
  REG_USERNAME_UNDEFINED: `${errBase.REG} a username wasn't provided. Please provide a user name and try again.`,
  REG_EMAIL_UNDEFINED: `${errBase.REG} an email address wasn't provided. Please provide an email address and try again.`,
  REG_PASSWORD_UNDEFINED: `${errBase.REG} a password wasn't provided. Please provide a password and try again.`,
  REG_USERNAME_IN_USE: `${errBase.REG} the username is already in use. Please change the requested username and try again.`,
  REG_EMAIL_IN_USE: `${errBase.REG} the email address is already in use. Please change the requested email address and try again.`,
  REG_PASSWORD_WEAK: `${errBase.REG} the password did not pass complexity requirements.`,

  ACTIVATE_TOKEN_UNDEFINED: `${errBase.ACTIVATE} the activation token wasn't provided. Please provide an activation token and try again.`,
  ACTIVATE_TOKEN_DECODE: `${errBase.ACTIVATE} the activation token was corrupted. Please provide the complete and correct activation token and try again.`,
  ACTIVATE_TOKEN_TYPE: `${errBase.ACTIVATE} the token was not made for activation. Please provide the correct activation token and try again.`,
  ACTIVATE_TOKEN_EXP: `${errBase.ACTIVATE} the token has expired. Please request a new user activation email.`,
  ACTIVATE_TOKEN_USR: `${errBase.ACTIVATE} the user could not be found in the system. Please request a new user activation email.`,

  AUTH_EMAIL_UNDEFINED: `${errBase.AUTH} an email address wasn't provided. Please provide an email address and try again.`,
  AUTH_PASSWORD_UNDEFINED: `${errBase.AUTH} a password wasn't provided. Please provide a password and try again.`,
  AUTH_FAIL: `Unable to authenticate user.`,

  TOKENWALL_UNDEFINED: `Token is required in req.headers.token.`,
  TOKENWALL_TYPE: `Token type is not access. Try again using a valid access token.`,
  TOKENWALL_EXPIRED: `Token expired.`,

  LASTSTOP_404: `The endpoint you are looking for can't be found.`,
  LASTSTOP_500: `Something went wrong.`,
}
type errMessageType = typeof errMessage
export type errMessageKeyType = keyof errMessageType
export type errMessageValueType = errMessageType[keyof errMessageType]

/**
 * Logging messages.
 */
export const logMessage = {
  LOG_REG_SUCCESS: `New user registration succeeded.`,
  LOG_ACTIVATE_SUCCESS: `New user activation succeeded.`,
  LOG_AUTHENTICATE_SUCCESS: `User authentication succeeded.`,
}
