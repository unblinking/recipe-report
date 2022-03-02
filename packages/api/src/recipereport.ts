/**
 * Recipe.Report API Server
 *
 * Verify all required environment variables are present, prepare the
 * middlewares, controllers, and port, and tell Express.js to listen for new
 * requests to come in.
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
import { json, RequestHandler } from 'express'
import Helmet from 'helmet'
import { injectable, multiInject } from 'inversify'
import 'reflect-metadata'

import { listen } from 'api/app'
import { IBaseController } from 'api/controllers/base-controller'
import { callHistory } from 'api/middlewares/callhistory'

import { Err, errEnv } from 'domain/models/err-model'

import { log } from 'service/log-service'

import { SYMBOLS } from './symbols'

export interface IRecipeReport {
  start(): void
}

@injectable()
export class RecipeReport implements IRecipeReport {
  private _controllers: IBaseController[]

  public constructor(@multiInject(SYMBOLS.IBaseController) controllers: IBaseController[]) {
    this._controllers = controllers
  }

  public start = (): void => {
    try {
      log.trace(`recipereport.ts start()`)
      process.stdout.write(this._graffiti)
      this._envVarCheck()
      const middlewares: Array<RequestHandler> = [
        Helmet({
          contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
          referrerPolicy: { policy: 'same-origin' },
        }),
        json(),
        callHistory,
      ]
      const controllers: Array<IBaseController> = this._controllers
      const port: number = parseInt(process.env.RR_PORT as string, 10)
      listen(middlewares, controllers, port)
    } catch (e) {
      log.fatal((e as Error).message)
      process.exit(1)
    }
  }

  /// Environment variables roll call. Shabooya, sha sha shabooya ROLL CALL!
  /// This confirms that necessary environment variables have been defined.
  private _envVarCheck = (): void => {
    log.trace(`envvarcheck.ts envVarCheck()`)
    if (!process.env.NODE_ENV) {
      log.warn(`NODE_ENV is not set. Assuming environment is not production.`)
    }
    if (!process.env.RR_PORT) throw new Err(`ENV_RR_PORT`, errEnv.ENV_RR_PORT)
    if (!process.env.RR_CRYPTO_KEY) throw new Err(`ENV_RR_CRYPTO_KEY`, errEnv.ENV_RR_CRYPTO_KEY)
    if (!process.env.RR_CRYPTO_ALGO) throw new Err(`ENV_RR_CRYPTO_ALGO`, errEnv.ENV_RR_CRYPTO_ALGO)
    if (!process.env.RR_CRYPTO_IV_LENGTH)
      throw new Err(`ENV_RR_CRYPTO_IV_LENGTH`, errEnv.ENV_RR_CRYPTO_IV_LENGTH)
    if (!process.env.RR_JWT_SECRET) throw new Err(`ENV_RR_JWT_SECRET`, errEnv.ENV_RR_JWT_SECRET)
    if (!process.env.RRDB_USER) throw new Err(`ENV_RRDB_USER`, errEnv.ENV_RRDB_USER)
    if (!process.env.RRDB_HOST) throw new Err(`ENV_RRDB_HOST`, errEnv.ENV_RRDB_HOST)
    if (!process.env.RRDB_DATABASE) throw new Err(`ENV_RRDB_DATABASE`, errEnv.ENV_RRDB_DATABASE)
    if (!process.env.RRDB_PASSWORD) throw new Err(`ENV_RRDB_PASSWORD`, errEnv.ENV_RRDB_PASSWORD)
    if (!process.env.RRDB_PORT) throw new Err(`ENV_RRDB_PORT`, errEnv.ENV_RRDB_PORT)
    if (!process.env.RRDB_URL) {
      log.warn(`RRDB_URL is not set. Database migrations are disabled.`)
    }
    if (!process.env.RRDB_MIGRATIONS) {
      log.warn(`RRDB_MIGRATIONS is not set. Database migrations are disabled.`)
    }
    if (!process.env.RR_LOG_TARGETS) {
      log.warn(`RR_LOG_TARGETS is not set. Logging is disabled.`)
    }
  }

  // Fun. Playful frivolity.
  private _version: string = process.env.npm_package_version as string
  private _stage: string = `Alpha`
  private _mode: string = (process.env.NODE_ENV as string) || `development`
  private _license: string = process.env.npm_package_license as string
  private _repository: string = `https://github.com/nothingworksright/api.recipe.report`
  private _graffiti: string = `\x1b[1m\x1b[32m ____           _
|  _ \\ ___  ___(_)_ __   ___
| |_) / _ \\/ __| | '_ \\ / _ \\
|  _ <  __/ (__| | |_) |  __/
|_|_\\_\\___|\\___|_| .__/ \\___|
|  _ \\ ___ _ __  |_|_  _ __| |_
| |_) / _ \\ '_ \\ / _ \\| '__| __|
|  _ <  __/ |_) | (_) | |  | |_
|_| \\_\\___| .__/ \\___/|_|   \\__|
\x1b[37m\x1b[33mAPI\x1b[1m\x1b[32m       |_|      \x1b[37m\x1b[33mversion ${this._version}\x1b[37m\x1b[21m

Release is \x1b[36m${this._stage}\x1b[37m
Running in \x1b[36m${this._mode}\x1b[37m mode
License \x1b[36m${this._license}\x1b[37m
Repository \x1b[36m${this._repository}\x1b[37m
\x1b[0m
`
}
