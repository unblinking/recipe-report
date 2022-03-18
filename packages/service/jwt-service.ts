/**
 * Token Service.
 *
 * Token encoding and decoding, with payload encrypting and decrypting.
 * A basic wrapper around jwt-simple, plus encrypted payload.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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
import { injectable } from 'inversify'
import jwt from 'jwt-simple'
import 'reflect-metadata'

import { Err, errClient, errInternal } from 'domain/models/err-model'
import { UniqueId } from 'domain/value/uid-value'

export interface IJwtService {
  encode(id: string | undefined, type: tokenType, ttl?: number, nbf?: number, enc?: string): string
  decode(token: string | undefined): Claims
}

export enum tokenType {
  NONE = 0, // Invalid (falsey) value by design.
  ACTIVATION = 1,
  ACCESS = 2,
}

export interface Claims {
  iss: string // Issuer
  sub: string // Subject
  aud: string // Audience
  exp: number // Expiration (in whole seconds)
  nbf: number // Not Before (in whole seconds)
  iat: number // Issued At (in whole seconds)
  jti: string // JWT ID
  typ: number // JWT Type
  enc?: string // Encrypted Data
}

export interface SecureClaims {
  uid: string
  type: tokenType
}

@injectable()
export class JwtService implements IJwtService {
  public encode = (
    id: string | undefined,
    type: tokenType,
    exp: number = Math.round(Date.now() / 1000) + 86400, // 24 hours from now, in whole seconds.
    nbf: number = Math.round(Date.now() / 1000), // Whole seconds.
    _enc: string,
  ): string => {
    // Determine our secret, from environment variable.
    const secret: string = process.env.RR_JWT_SECRET as string
    // Verify that we aren't missing anything important.
    if (!secret) throw new Err(`JWT_SECRET_KEY`, errInternal.JWT_SECRET_KEY)
    if (!id) throw new Err(`JWT_USER_ID`, errInternal.JWT_USER_ID)
    // Note: tokenType.NONE is zero, a falsey value, so that would cause
    // an error here just as if type was undefined.
    if (!type) throw new Err(`JWT_TYPE`, errInternal.JWT_TYPE)
    // Preapre the payload.
    const payload: Claims = {
      iss: `api.recipe.report`,
      sub: id,
      aud: `api.recipe.report`,
      exp: exp,
      nbf: nbf,
      iat: Math.round(Date.now() / 1000), // Whole seconds.
      jti: UniqueId.create().value,
      typ: type,
      enc: _enc,
    }
    // Encode a JWT, containing the claims, and return it.
    const encoded: string = jwt.encode(payload, secret, 'HS512')
    return encoded
  }

  public decode = (token: string | undefined): Claims => {
    // Determine our secret, from environment variable.
    const secret: string = process.env.RR_JWT_SECRET as string
    // Verify that we aren't missing anything important.
    if (!secret) throw new Err(`JWT_SECRET_KEY`, errInternal.JWT_SECRET_KEY)
    if (!token) throw new Err(`JWT_TOKEN`, errInternal.JWT_TOKEN)
    // Decode the JWT. The signature of the token is verified.
    let payload
    try {
      payload = jwt.decode(token, secret, false, 'HS512')
    } catch (e) {
      if (e instanceof Error && e.message == 'Token expired') {
        throw new Err('TOKEN_EXP', errClient.TOKEN_EXP)
      } else if (e instanceof Error && e.message == 'Token not yet active') {
        throw new Err('TOKEN_NBF', errClient.TOKEN_NBF)
      } else {
        throw new Err('TOKEN_INVALID', errClient.TOKEN_INVALID)
      }
    }
    return payload
  }
}
