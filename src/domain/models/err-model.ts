/**
 * Error model.
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

/**
 * Extended class based on the Error class.
 * Set a name and message all at once. Remarkable!
 *
 * Some of the helpers below were created based on ...
 * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 *
 * Instantiate error objects with a custom name in one line, with type safety
 * enforced for the name and message. Error messages must be defined in the
 * global constants before they may be used.
 */
export class Err extends Error {
  public constructor(
    name: errMessageKeyType | errBaseKeyType,
    message: errMessageValueType | errBaseValueType,
  ) {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype)
  }

  // Type-guard using a type-predicate method.
  public static isErr(error: unknown): error is Err {
    return (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      typeof (error as Record<string, unknown>).name === 'string' &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    )
  }

  // Try to convert an object into an Err.
  public static toErr(maybeError: unknown): Err {
    if (Err.isErr(maybeError)) {
      return maybeError
    } else {
      try {
        return new Err(`UNKNOWN`, JSON.stringify(maybeError))
      } catch {
        // Fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Err(`UNKNOWN`, String(maybeError))
      }
    }
  }

  public static getErrName(error: unknown): string {
    return Err.toErr(error).name
  }

  public static getErrMessage(error: unknown): string {
    return Err.toErr(error).message
  }
}

//#region Error message constants.

/**
 * Error message base statements.
 */
export const errBase = {
  REG: `The user couldn't be registered.`, // User registration endpoint.
  ACTIVATE: `The user couldn't be activated.`, // User activation endpoint.
  AUTH: `The user couldn't be authenticated.`, // User authentication endpoint.
}
type errBaseType = typeof errBase
export type errBaseKeyType = keyof errBaseType
export type errBaseValueType = keyof errBaseType

/**
 * Error messages.
 */
export const errMsg = {
  // Environment variable check.
  ENV_RR_PORT: `RR_PORT is not set. This is required for Expressjs to listen.`,
  ENV_RR_CRYPTO_KEY: `RR_CRYPTO_KEY is not set. This is required for encrypting and decrypting data.`,
  ENV_RR_CRYPTO_ALGO: `RR_CRYPTO_ALGO is not set. This is required for encrypting and decrypting data.`,
  ENV_RR_CRYPTO_IV_LENGTH: `RR_CRYPTO_IV_LENGTH is not set. This is required for encrypting and decrypting data.`,
  ENV_RR_JWT_SECRET: `RR_JWT_SECRET is not set. This is required for encoding and decoding JSON web tokens.`,
  ENV_RRDB_USER: `RRDB_USER is not set. This is required for database communication.`,
  ENV_RRDB_HOST: `RRDB_HOST is not set. This is required for database communication.`,
  ENV_RRDB_DATABASE: `RRDB_DATABASE is not set. This is required for database communication.`,
  ENV_RRDB_PASSWORD: `RRDB_PASSWORD is not set. This is required for database communication.`,
  ENV_RRDB_PORT: `RRDB_PORT is not set. This is required for database communication.`,
  // User registration.
  REG_REQUIRED_UNDEF: `${errBase.REG} Missing required field(s): "name", "password", and "email address".`,
  REG_USRNAME_UNDEF: `${errBase.REG} A username wasn't provided. Please provide a user name and try again.`,
  REG_EMAIL_UNDEF: `${errBase.REG} An email address wasn't provided. Please provide an email address and try again.`,
  REG_PASS_UNDEF: `${errBase.REG} A password wasn't provided. Please provide a password and try again.`,
  REG_USRNAME_USED: `${errBase.REG} The username is already in use. Please change the requested username and try again.`,
  REG_EMAIL_USED: `${errBase.REG} The email address is already in use. Please change the requested email address and try again.`,
  // User service activation.
  ACTIV_TOKEN_UNDEF: `${errBase.ACTIVATE} The activation token wasn't provided. Please provide an activation token and try again.`,
  ACTIV_TOKEN_DECODE: `${errBase.ACTIVATE} The activation token was corrupted. Please provide the complete and correct activation token and try again.`,
  ACTIV_TOKEN_TYPE: `${errBase.ACTIVATE} The token was not made for activation. Please provide the correct activation token and try again.`,
  ACTIV_TOKEN_EXP: `${errBase.ACTIVATE} The token has expired. Please request a new user activation email.`,
  ACTIV_TOKEN_USR: `${errBase.ACTIVATE} The user could not be found in the system. Please request a new user activation email.`,
  // User service authentication.
  AUTH_REQUIRED_UNDEF: `${errBase.AUTH} Missing required field(s): "email_address" and "password".`,
  // Tokenwall middleware.
  TOKENWALL_UNDEF: `Token is required in req.headers.token.`,
  TOKENWALL_TYPE: `Token type is not access. Try again using a valid access token.`,
  TOKENWALL_EXP: `Token expired.`,
  // Laststop middleware.
  LASTSTOP_404: `The endpoint you are looking for can't be found.`,
  LASTSTOP_500: `Something went wrong.`,
  // Model validation.
  MISSING_REQ: `One or more required fields are missing.`,
  UID_INVALID: `The supplied UUID is not a valid v4 UUID.`,
  NAME_INVALID: `The name field is not in a valid format. Usename must be 1 to 50 characters in length, and contain only A-Z and 0-9.`,
  EMAIL_INVALID: `The email address is not in a valid format.`,
  PASS_WEAK: `The password did not pass complexity requirements.`,
  TOKEN_INVALID: `The token is not in a valid format.`,
  // Cryptography wrapper.
  CRYPTO_KEY: `Crypto key is not defined.`,
  CRYPTO_IV_LENGTH: `IV length is not defined.`,
  CRYPTO_ALGO: `Algorithm is not defined.`,
  // Email transactional wrapper.
  EMAIL_FROM: `Email FROM address is not defined.`,
  EMAIL_TO: `Email TO address is not defined.`,
  EMAIL_SUBJECT: `Email SUBJECT is not defined.`,
  EMAIL_BODY: `Email BODY is not defined.`,
  EMAIL_MS_API_KEY: `MailerSend API Key is not defined.`,
  // JWT service.
  JWT_SECRET_KEY: `JWT error. Secret key is not defined.`,
  JWT_USER_ID: `JWT error. User ID is not defined.`,
  JWT_TYPE: `JWT error. Type is not defined.`,
  JWT_TOKEN: `JWT error. Token is not defined.`,
  // Unit of work.
  UOW_CLIENT: `UOW error. Pool client is not defined.`,
  // Repositories.
  HASH_SALT: `Error hashing password.`,
  // Unknown.
  UNKNOWN: `Unknown error.`,
}
type errMessageType = typeof errMsg
export type errMessageKeyType = keyof errMessageType
export type errMessageValueType = errMessageType[keyof errMessageType]

//#endregion
