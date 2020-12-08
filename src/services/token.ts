/**
 * Token service.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import jwt from 'jwt-simple'
import { Cryptography } from './cryptography'

interface IToken {
  encodeToken(userId: string, type: string, ttl: BigInteger): string
  decodeToken(token: string): Payload
}

export interface Payload {
  id: string
  type: string
  iat: string
  ttl: BigInteger
}

/**
 * Token service.
 * Token encoding and decoding, with payload encrypting and decrypting.
 *
 * @export
 * @class Token
 */
export class Token implements IToken {
  private cryptography: Cryptography = new Cryptography()

  /**
   * Encode a JWT and encrypt its payload.
   *
   * @memberof Token
   * @returns A JWT containing an encrypted payload.
   */
  public encodeToken = (
    userId: string,
    type: string,
    ttl: BigInteger
  ): string => {
    // Determine our secret, from environment variable.
    const secret: string = process.env.JWT_SECRET as string
    // Verify that we aren't missing anything important.
    if (!secret) throw new Error(`JWT error. Secret key is not defined.`)
    if (!userId) throw new Error(`JWT error. User ID is not defined.`)
    if (!type) throw new Error(`JWT error. Type is not defined.`)
    // Instantiate the payload.
    const payload: Payload = {
      id: userId,
      type: type,
      iat: new Date().toISOString(),
      ttl: ttl,
    }
    // Stringify and encrypt the payload.
    const stringified: string = JSON.stringify(payload)
    const encryptedPayload: string = this.cryptography.encrypt(stringified)
    // Encode a JWT, containing the encrypted payload, and return it.
    const encodedToken: string = jwt.encode(encryptedPayload, secret, 'HS512')
    return encodedToken
  }

  /**
   * Decode a JWT and decrypt its payload.
   *
   * @memberof Token
   * @returns A decrypted payload from a JWT.
   */
  public decodeToken = (token: string): Payload => {
    // Determine our secret, from environment variable.
    const secret: string = process.env.JWT_SECRET as string
    // Verify that we aren't missing anything important.
    if (!secret) throw new Error(`JWT error. Secret key is not defined.`)
    if (!token) throw new Error(`JWT error. Token is not defined.`)
    // Decode the JWT. The signature of the token is verified.
    const decodedToken: string = jwt.decode(token, secret, false, 'HS512')
    // Decrypt and parse the payload.
    const decryptedPayload: string = this.cryptography.decrypt(decodedToken)
    const parsed: Payload = JSON.parse(decryptedPayload)
    return parsed
  }
}
