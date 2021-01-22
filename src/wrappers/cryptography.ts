/**
 * Cryptography.
 * A basic wrapper around the node.js built-in crypto module.
 * @see {@link https://nodejs.org/api/crypto.html Crypto}
 * Based on the following ...
 * Original Gist
 * @author {@link https://github.com/vlucas Vance Lucas}
 * @see {@link https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb Gist}
 * Forked Gist of the original Gist
 * @author {@link https://github.com/Miki79 Miki}
 * @see {@link https://gist.github.com/Miki79/7e8d5d3798343e0d178863cbce4fe355 Gist}
 */

import Crypto from 'crypto'

const key: string = process.env.CRYPTO_KEY as string
const ivLength: number = parseInt(process.env.CRYPTO_IV_LENGTH as string, 10)
const algorithm: string = process.env.CRYPTO_ALGO as string

const varCheck = (): void => {
  if (!key) throw new Error(`Crypto error. Crypto key is not defined.`)
  if (!ivLength) throw new Error(`Crypto error. IV length is not defined.`)
  if (!algorithm) throw new Error(`Crypto error. Algorithm is not defined.`)
}

/**
 * Encrypt a plaintext string.
 * @returns An encrypted encoded string.
 */
export const encrypt = (plainText: string): string => {
  varCheck()
  // Initialization vector.
  // Generate a cryptographically-secure random nonce buffer.
  const iv: Buffer = Crypto.randomBytes(ivLength)
  // Cipher object.
  // Create a cipher object with the defined algorithm, crypto key, and
  // the random initialization vector we just generated.
  const cipher: Crypto.Cipher = Crypto.createCipheriv(
    algorithm,
    Buffer.from(key),
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
 * @returns A decoded decrypted plaintext string.
 */
export const decrypt = (encryptedEncodedText: string): string => {
  varCheck()
  // Buffer from decoding the base64 string.
  const encrypted: Buffer = Buffer.from(encryptedEncodedText, 'base64')
  // Length of the encrypted text by itself.
  const encryptedLength: number = encrypted.length - ivLength
  // Initialization vector sliced off of the encrypted buffer.
  const iv: Buffer = encrypted.slice(encryptedLength)
  // Encrypted text sliced off of the encrypted buffer.
  const encryptedText: Buffer = encrypted.slice(0, encryptedLength)
  // De-cipher object.
  // Create a decipher object with the defined algorithm, crypto key, and
  // the initialization vector we just sliced off of the encrypted buffer.
  const decipher: Crypto.Decipher = Crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
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
