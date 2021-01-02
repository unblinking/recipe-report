/**
 * Environment variables roll call.
 * Shabooya, sha sha shabooya ROLL CALL!
 */

import { logger } from './wrappers/log'

export const envVarCheck = logger.wrap(function envVarCheck(): void {
  if (!process.env.EXPRESS_PORT) throw new Error(`EXPRESS_PORT is not defined.`)
  if (!process.env.CRYPTO_KEY) throw new Error(`CRYPTO_KEY is not defined.`)
  if (!process.env.CRYPTO_ALGO) throw new Error(`CRYPTO_ALGO is not defined.`)
  if (!process.env.CRYPTO_IV_LENGTH)
    throw new Error(`CRYPTO_IV_LENGTH is not defined.`)
  if (!process.env.JWT_SECRET) throw new Error(`JWT_SECRET is not defined.`)
  if (!process.env.DB_USER) throw new Error(`DB_USER is not defined.`)
  if (!process.env.DB_HOST) throw new Error(`DB_HOST is not defined.`)
  if (!process.env.DB_DATABASE) throw new Error(`DB_DATABASE is not defined.`)
  if (!process.env.DB_PASSWORD) throw new Error(`DB_PASSWORD is not defined.`)
  if (!process.env.DB_PORT) throw new Error(`DB_PORT is not defined.`)
})
