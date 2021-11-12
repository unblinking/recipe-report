/**
 * Environment variables roll call. Shabooya, sha sha shabooya ROLL CALL!
 *
 * This confirms that necessary environment variables have been defined.
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

import { logger } from './wrappers/log'
import { Err } from './wrappers/error'
import { errMsg } from './constants'

export const envVarCheck = (): void => {
  logger.trace(`envvarcheck.ts envVarCheck()`)
  if (!process.env.NODE_ENV) {
    logger.warn(`NODE_ENV is not set. Assuming environment is not production.`)
  }
  if (!process.env.PORT) throw new Err(`ENV_PORT`, errMsg.ENV_PORT)
  if (!process.env.CRYPTO_KEY)
    throw new Err(`ENV_CRYPTO_KEY`, errMsg.ENV_CRYPTO_KEY)
  if (!process.env.CRYPTO_ALGO)
    throw new Err(`ENV_CRYPTO_ALGO`, errMsg.ENV_CRYPTO_ALGO)
  if (!process.env.CRYPTO_IV_LENGTH)
    throw new Err(`ENV_CRYPTO_IV_LENGTH`, errMsg.ENV_CRYPTO_IV_LENGTH)
  if (!process.env.JWT_SECRET)
    throw new Err(`ENV_JWT_SECRET`, errMsg.ENV_JWT_SECRET)
  if (!process.env.DB_USER) throw new Err(`ENV_DB_USER`, errMsg.ENV_DB_USER)
  if (!process.env.DB_HOST) throw new Err(`ENV_DB_HOST`, errMsg.ENV_DB_HOST)
  if (!process.env.DB_DATABASE)
    throw new Err(`ENV_DB_DATABASE`, errMsg.ENV_DB_DATABASE)
  if (!process.env.DB_PASSWORD)
    throw new Err(`ENV_DB_PASSWORD`, errMsg.ENV_DB_PASSWORD)
  if (!process.env.DB_PORT) throw new Err(`ENV_DB_PORT`, errMsg.ENV_DB_PORT)
  if (!process.env.FLYWAY_URL) {
    logger.warn(`FLYWAY_URL is not set. Database migrations are disabled.`)
  }
  if (!process.env.FLYWAY_MIGRATIONS) {
    logger.warn(
      `FLYWAY_MIGRATIONS is not set. Database migrations are disabled.`
    )
  }
  if (!process.env.MY_LOG_TARGETS) {
    logger.warn(`MY_LOG_TARGETS is not set. Logging is disabled.`)
  }
}
