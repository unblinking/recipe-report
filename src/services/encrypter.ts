/**
 * Encrypter service.
 * General encryption wrapper.
 *
 * Based on the following ...
 * Original Gist
 * @author {@link https://github.com/vlucas Vance Lucas}
 * @see {@link https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb Gist}
 * Forked Gist of the original Gist
 * @author {@link https://github.com/Miki79 Miki}
 * @see {@link https://gist.github.com/Miki79/7e8d5d3798343e0d178863cbce4fe355 Gist}
 */

/** External imports. */
import Crypto from 'crypto'

/** Internal imports. */
import Logger from './logger'

/**
 * Encrypter service.
 * A wrapper for the built-in Nodejs lib/crypto module.
 *
 * @class Encrypter
 */
class Encrypter {
  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof RecipeReport
   */
  private logger: Logger = new Logger()

  /**
   * Cryptographic key.
   *
   * @private
   * @type {string}
   * @memberof Encrypter
   */
  private key: string = process.env.CRYPTO_KEY ?? ``

  /**
   * Length for generating a cryptographically secure random nonce.
   *
   * @private
   * @type {number}
   * @memberof Encrypter
   */
  private ivLength: number = parseInt(process.env.CRYPTO_IV_LENGTH ?? ``, 10)

  /**
   * Encryption algorithm.
   *
   * @private
   * @type {string}
   * @memberof Encrypter
   */
  private algorithm: string = process.env.CRYPTO_ALGO ?? ``

  public encrypt = async (plainText: string): Promise<unknown> => {
    const promise = new Promise((resolve, reject) => {
      try {
        /**
         * Initialization vector.
         * Generate a cryptographically-secure random nonce buffer.
         */
        const iv = Crypto.randomBytes(this.ivLength)

        /**
         * Cipher object.
         * Create a cipher object with the defined algorithm, crypto key, and
         * the random initialization vector we just generated.
         */
        const cipher = Crypto.createCipheriv(
          this.algorithm,
          Buffer.from(this.key),
          iv
        )

        /** Buffer from updating the cipher with the plantext. */
        let encrypted: Buffer = cipher.update(plainText)

        /** Join the buffer objects into a single buffer object. */
        encrypted = Buffer.concat([encrypted, cipher.final(), iv])

        /** Encode encrypted data as a base64 string. */
        const encryptedEncodedText = encrypted.toString('base64')

        /** Resolve the promise with the encrypted/encoded string. */
        resolve(encryptedEncodedText)
      } catch (error) {
        this.logger.write(error)
        reject(error)
      }
    })
    return promise
  }

  public decrypt = async (encryptedEncodedText: string): Promise<unknown> => {
    const promise = new Promise((resolve, reject) => {
      try {
        /** Buffer from decoding the base64 string. */
        const encrypted = Buffer.from(encryptedEncodedText, 'base64')

        /** Length of the encrypted text by itself. */
        const encryptedLength = encrypted.length - this.ivLength

        /** Initialization vector sliced off of the encrypted buffer.. */
        const iv = encrypted.slice(encryptedLength)

        /** Encrypted text sliced off of the encrypted buffer. */
        const encryptedText = encrypted.slice(0, encryptedLength)

        /**
         * De-cipher object.
         * Create a decipher object with the defined algorithm, crypto key, and
         * the initialization vector we just sliced off of the encrypted buffer.
         */
        const decipher = Crypto.createDecipheriv(
          this.algorithm,
          Buffer.from(this.key),
          iv
        )

        /** Buffer from updating the decipher with the encrypted text. */
        let decrypted = decipher.update(encryptedText)

        /** Join the buffer objects into a single buffer object. */
        decrypted = Buffer.concat([decrypted, decipher.final()])

        /** Decrypted buffer to a string. */
        const plainText = decrypted.toString()

        /** Resolve the promise with the decoded/decrypted string. */
        resolve(plainText)
      } catch (error) {
        this.logger.write(error)
        reject(error)
      }
    })
    return promise
  }
}

export default Encrypter
