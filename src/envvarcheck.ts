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

export const envVarCheck = (): void => {
  logger.trace(`Checking for required environment variables.`)
  if (!process.env.PORT) throw new Error(`PORT is not defined.`)
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
}
