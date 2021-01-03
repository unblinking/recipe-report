/**
 * Token.
 * Token encoding and decoding, with payload encrypting and decrypting.
 * A basic wrapper around jwt-simple, plus encrypted payload.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import jwt from 'jwt-simple'
import { encrypt, decrypt } from './cryptography'

export enum tokenType {
  NONE = 0,
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
  ttl: number
): string => {
  // Determine our secret, from environment variable.
  const secret: string = process.env.JWT_SECRET as string
  // Verify that we aren't missing anything important.
  if (!secret) throw new Error(`JWT error. Secret key is not defined.`)
  if (!userId) throw new Error(`JWT error. User ID is not defined.`)
  // Note: tokenType.NONE is zero, which is a falsey value, so that would cause
  // an error here just as if type was undefined.
  if (!type) throw new Error(`JWT error. Type is not defined.`)
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
  if (!secret) throw new Error(`JWT error. Secret key is not defined.`)
  if (!token) throw new Error(`JWT error. Token is not defined.`)
  // Decode the JWT. The signature of the token is verified.
  const decodedToken: string = jwt.decode(token, secret, false, 'HS512')
  // Decrypt and parse the payload.
  const decryptedPayload: string = decrypt(decodedToken)
  const parsed: Payload = JSON.parse(decryptedPayload)
  return parsed
}
