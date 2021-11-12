/**
 * Token.
 *
 * Token encoding and decoding, with payload encrypting and decrypting.
 * A basic wrapper around jwt-simple, plus encrypted payload.
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

import jwt from 'jwt-simple'
import { encrypt, decrypt } from './cryptography'
import { Err } from '../wrappers/error'
import { errMsg } from '../constants'

export enum tokenType {
  NONE = 0, // Invalid (falsey) value by design.
  ACTIVATION = 1,
  ACCESS = 2,
}

export interface Payload {
  id: string
  type: tokenType
  iat: number
  ttl: number
}

/**
 * Encode a JWT and encrypt its payload.
 * @returns A JWT containing an encrypted payload.
 */
export const encodeToken = (
  userId: string,
  type: tokenType,
  ttl: number = new Date().getTime() + 60 * 60 * 24 * 1000 // Default 24 hours.
): string => {
  // Determine our secret, from environment variable.
  const secret: string = process.env.JWT_SECRET as string
  // Verify that we aren't missing anything important.
  if (!secret) throw new Err(`JWT_SECRET_KEY`, errMsg.JWT_SECRET_KEY)
  if (!userId) throw new Err(`JWT_USER_ID`, errMsg.JWT_USER_ID)
  // Note: tokenType.NONE is zero, which is a falsey value, so that would cause
  // an error here just as if type was undefined.
  if (!type) throw new Err(`JWT_TYPE`, errMsg.JWT_TYPE)
  // Instantiate the payload.
  const payload: Payload = {
    id: userId,
    type: type,
    iat: new Date().getTime(),
    ttl: ttl,
  }
  // Stringify and encrypt the payload.
  const stringified: string = JSON.stringify(payload)
  const encryptedPayload: string = encrypt(stringified)
  // Encode a JWT, containing the encrypted payload, and return it.
  const encodedToken: string = jwt.encode(encryptedPayload, secret, 'HS512')
  return encodedToken
}

/**
 * Decode a JWT and decrypt its payload.
 * @returns A decrypted payload from a JWT.
 */
export const decodeToken = (token: string | undefined): Payload => {
  // Determine our secret, from environment variable.
  const secret: string = process.env.JWT_SECRET as string
  // Verify that we aren't missing anything important.
  if (!secret) throw new Err(`JWT_SECRET_KEY`, errMsg.JWT_SECRET_KEY)
  if (!token) throw new Err(`JWT_TOKEN`, errMsg.JWT_TOKEN)
  // Decode the JWT. The signature of the token is verified.
  const decodedToken: string = jwt.decode(token, secret, false, 'HS512')
  // Decrypt and parse the payload.
  const decryptedPayload: string = decrypt(decodedToken)
  const parsed: Payload = JSON.parse(decryptedPayload)
  return parsed
}
