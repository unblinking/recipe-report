/**
 * Token Service.
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

import { errMsg } from '../data/constants'

import { Err } from '../utils'

import { decrypt, encrypt } from './cryptography-service'

interface IJwtService {
  encode(userId: string, type: tokenType, ttl: number): string
  decode(token: string | undefined): Payload
}

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

export class JwtService implements IJwtService {
  private _secret: string

  constructor(secret: string | undefined) {
    this._secret = secret ? secret : (process.env.JWT_SECRET as string)
  }

  /**
   * Encode a JWT and encrypt its payload.
   * @returns A JWT containing an encrypted payload.
   */
  public encode = (
    id: string,
    type: tokenType,
    ttl: number = new Date().getTime() + 60 * 60 * 24 * 1000, // 24 hours.
  ): string => {
    // Verify that we aren't missing anything important.
    if (!id) throw new Err(`JWT_USER_ID`, errMsg.JWT_USER_ID)
    // Note: tokenType.NONE is zero, a falsey value, so that would cause
    // an error here just as if type was undefined.
    if (!type) throw new Err(`JWT_TYPE`, errMsg.JWT_TYPE)
    // Instantiate the payload.
    const iat = new Date().getTime()
    const payload: Payload = { id: id, type: type, iat: iat, ttl: ttl }
    // Stringify and encrypt the payload.
    const stringified: string = JSON.stringify(payload)
    const encrypted: string = encrypt(stringified)
    // Encode a JWT, containing the encrypted payload, and return it.
    const encoded: string = jwt.encode(encrypted, this._secret, 'HS512')
    return encoded
  }

  /**
   * Decode a JWT and decrypt its payload.
   * @returns A decrypted payload from a JWT.
   */
  public decode = (token: string | undefined): Payload => {
    // Verify that we aren't missing anything important.
    if (!token) throw new Err(`JWT_TOKEN`, errMsg.JWT_TOKEN)
    // Decode the JWT. The signature of the token is verified.
    const decoded: string = jwt.decode(token, this._secret, false, 'HS512')
    // Decrypt and parse the payload.
    const decrypted: string = decrypt(decoded)
    const parsed: Payload = JSON.parse(decrypted)
    return parsed
  }
}
