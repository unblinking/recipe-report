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
    name:
      | errMessageKeyType
      | errEnvKeyType
      | errUserKeyType
      | errClientKeyType
      | errInternalKeyType,
    message:
      | errMessageValueType
      | errEnvValueType
      | errUserValueType
      | errClientValueType
      | errInternalValueType,
  ) {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype)
  }

  // Type-guard using a type-predicate method.
  // Do our best to determine if the unknown is an Err.
  public static isErr(unknown: unknown): unknown is Err {
    return (
      typeof unknown === 'object' &&
      unknown !== null &&
      'name' in unknown &&
      typeof (unknown as Record<string, unknown>).name === 'string' &&
      'message' in unknown &&
      typeof (unknown as Record<string, unknown>).message === 'string'
    )
  }

  // Convert an object into an Err.
  // Used in the catch of a try/catch. The caught object might be anything.
  // Here we take that object and return it as an Err.
  public static toErr(unknown: unknown): Err {
    if (Err.isErr(unknown)) {
      return unknown
    } else {
      try {
        return new Err(`UNKNOWN`, JSON.stringify(unknown))
      } catch {
        // Fallback in case there's an error stringifying the unknown object
        // like with circular references for example.
        return new Err(`UNKNOWN`, String(unknown))
      }
    }
  }

  public static getErrName(unknown: unknown): string {
    return Err.toErr(unknown).name
  }

  public static getErrMessage(unknown: unknown): string {
    return Err.toErr(unknown).message
  }
}

//#region Error message constants.

// Environment variable error messages.
export const errEnv = {
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
}
type errEnvType = typeof errEnv
export type errEnvKeyType = keyof errEnvType
export type errEnvValueType = errEnvType[keyof errEnvType]

// Basic user related error messages.
export const errUser = {
  REGISTER: `The user couldn't be registered.`,
  ACTIVATE: `The user couldn't be activated.`,
  AUTHENTICATE: `The user couldn't be authenticated.`,
}
type errUserType = typeof errUser
export type errUserKeyType = keyof errUserType
export type errUserValueType = errUserType[keyof errUserType]

export const errClient = {
  MISSING_REQ: `One or more required fields are missing.`,
  NAME_INVALID: `The name field is not in a valid format. Usename must be 2 to 50 characters in length, and contain only A-Z and 0-9.`,
  NAME_USED: `The name is already in use. Please change the requested name and try again.`,
  EMAIL_INVALID: `The email address is not in a valid format.`,
  EMAIL_USED: `The email address is already in use. Please change the requested email address and try again.`,
  PASSWORD_WEAK: `The password did not pass complexity requirements.`,
  UID_INVALID: `The supplied UUID is not a valid v4 UUID.`,
  TOKEN_INVALID: `The token is not in a valid format.`,
  TOKENWALL_UNDEF: `Token is required.`,
  TOKENWALL_TYPE: `Token type is not access. Try again using a valid access token.`,
  TOKENWALL_EXP: `Token has expired.`,
  LASTSTOP_404: `The endpoint you are looking for can't be found.`,
  LASTSTOP_500: `Something went wrong.`,
}
type errClientType = typeof errClient
export type errClientKeyType = keyof errClientType
export type errClientValueType = errClientType[keyof errClientType]
export const isErrClient = (key: string): key is errClientKeyType => {
  return Object.keys(errClient).includes(key)
}

export const errInternal = {
  CRYPTO_KEY: `Crypto key is not defined.`,
  CRYPTO_IV_LENGTH: `IV length is not defined.`,
  CRYPTO_ALGO: `Algorithm is not defined.`,
  JWT_SECRET_KEY: `JWT error. Secret key is not defined.`,
  JWT_USER_ID: `JWT error. User ID is not defined.`,
  JWT_TYPE: `JWT error. Type is not defined.`,
  JWT_TOKEN: `JWT error. Token is not defined.`,
  UOW_CLIENT: `UOW error. Pool client is not defined.`,
  DOMAIN_OBJECT: `Error creating domain object.`,
  EMAIL_FROM: `Email FROM address is not defined.`,
  EMAIL_TO: `Email TO address is not defined.`,
  EMAIL_SUBJECT: `Email SUBJECT is not defined.`,
  EMAIL_BODY: `Email BODY is not defined.`,
  EMAIL_MS_API_KEY: `MailerSend API Key is not defined.`,
  UNKNOWN: `Unknown error.`,
}
type errInternalType = typeof errInternal
export type errInternalKeyType = keyof errInternalType
export type errInternalValueType = errInternalType[keyof errInternalType]

export const errMsg = {
  // User service activation.
  ACTIV_TOKEN_UNDEF: `${errUser.ACTIVATE} The activation token wasn't provided. Please provide an activation token and try again.`,
  ACTIV_TOKEN_DECODE: `${errUser.ACTIVATE} The activation token was corrupted. Please provide the complete and correct activation token and try again.`,
  ACTIV_TOKEN_TYPE: `${errUser.ACTIVATE} The token was not made for activation. Please provide the correct activation token and try again.`,
  ACTIV_TOKEN_EXP: `${errUser.ACTIVATE} The token has expired. Please request a new user activation email.`,
  ACTIV_TOKEN_USR: `${errUser.ACTIVATE} The user could not be found in the system. Please request a new user activation email.`,

  // User service authentication.
  AUTH_REQUIRED_UNDEF: `${errUser.AUTHENTICATE} Missing required field(s): "email_address" and "password".`,
}
type errMessageType = typeof errMsg
export type errMessageKeyType = keyof errMessageType
export type errMessageValueType = errMessageType[keyof errMessageType]

//#endregion