/**
 * Cryptography service.
 * Based on the following ...
 * Original Gist
 * @author {@link https://github.com/vlucas Vance Lucas}
 * @see {@link https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb Gist}
 * Forked Gist of the original Gist
 * @author {@link https://github.com/Miki79 Miki}
 * @see {@link https://gist.github.com/Miki79/7e8d5d3798343e0d178863cbce4fe355 Gist}
 */

import Crypto from 'crypto'

interface ICryptography {
  key: string
  ivLength: number
  algorithm: string
  encrypt(plainText: string): string
  decrypt(encryptedEncodedText: string): string
}

/**
 * Cryptography service.
 * A wrapper for the built-in Nodejs lib/crypto module.
 *
 * @class Cryptography
 */
export class Cryptography implements ICryptography {
  key: string = process.env.CRYPTO_KEY as string
  ivLength: number = parseInt(process.env.CRYPTO_IV_LENGTH as string, 10)
  algorithm: string = process.env.CRYPTO_ALGO as string

  constructor() {
    if (!this.key) throw new Error(`Crypto error. Crypto key is not defined.`)
    if (!this.ivLength)
      throw new Error(`Crypto error. IV length is not defined.`)
    if (!this.algorithm)
      throw new Error(`Crypto error. Algorithm is not defined.`)
  }

  /**
   * Encrypt a plaintext string.
   *
   * @memberof Cryptography
   * @returns An encrypted encoded string.
   */
  public encrypt = (plainText: string): string => {
    // Initialization vector.
    // Generate a cryptographically-secure random nonce buffer.
    const iv: Buffer = Crypto.randomBytes(this.ivLength)
    // Cipher object.
    // Create a cipher object with the defined algorithm, crypto key, and
    // the random initialization vector we just generated.
    const cipher: Crypto.Cipher = Crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv
    )
    // Buffer from updating the cipher with the plantext.
    let encrypted: Buffer = cipher.update(plainText)
    // Join the buffer objects into a single buffer object.
    encrypted = Buffer.concat([encrypted, cipher.final(), iv])
    // Encode encrypted data as a base64 string.
    const encryptedEncodedText: string = encrypted.toString('base64')
    // Resolve the promise with the encrypted/encoded string.
    return encryptedEncodedText
  }

  /**
   * Decrypt a string.
   *
   * @memberof Cryptography
   * @returns A decoded decrypted plaintext string.
   */
  public decrypt = (encryptedEncodedText: string): string => {
    // Buffer from decoding the base64 string.
    const encrypted: Buffer = Buffer.from(encryptedEncodedText, 'base64')
    // Length of the encrypted text by itself.
    const encryptedLength: number = encrypted.length - this.ivLength
    // Initialization vector sliced off of the encrypted buffer.
    const iv: Buffer = encrypted.slice(encryptedLength)
    // Encrypted text sliced off of the encrypted buffer.
    const encryptedText: Buffer = encrypted.slice(0, encryptedLength)
    // De-cipher object.
    // Create a decipher object with the defined algorithm, crypto key, and
    // the initialization vector we just sliced off of the encrypted buffer.
    const decipher: Crypto.Decipher = Crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv
    )
    // Buffer from updating the decipher with the encrypted text.
    let decrypted: Buffer = decipher.update(encryptedText)
    // Join the buffer objects into a single buffer object.
    decrypted = Buffer.concat([decrypted, decipher.final()])
    // Decrypted buffer to a string.
    const plainText: string = decrypted.toString()
    // Resolve the promise with the decoded/decrypted string.
    return plainText
  }
}
