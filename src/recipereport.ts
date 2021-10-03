/**
 * Recipe.Report API Server
 *
 * This is the 'main' script for the Recipe.Report API server. It will run the
 * program in production mode.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/api.recipe.report}
 *
 * Recipe.Report API is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Recipe.Report API is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { RequestHandler } from 'express'
import * as BodyParser from 'body-parser'
import Helmet from 'helmet'
import HerokuSslRedirect from 'heroku-ssl-redirect'

import { logger } from './wrappers/log'
import { graffiti } from './factories/fun-factory'
import { envVarCheck } from './envvarcheck'
import { listen } from './wrappers/app'

import { callHistory } from './middlewares/callhistory'

import { IController } from './controllers/interfaces'
import { RootController } from './controllers/root-controller'
import { TestTokenController } from './controllers/testtoken-controller'
import { UserController } from './controllers/user-controller'

const port: number = parseInt(process.env.EXPRESS_PORT as string, 10)

const middlewares: Array<RequestHandler> = [
  Helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
    referrerPolicy: { policy: 'same-origin' },
  }),
  HerokuSslRedirect(),
  BodyParser.json(),
  BodyParser.urlencoded({ extended: true }),
  callHistory,
]

const controllers: Array<IController> = [
  new RootController(),
  new TestTokenController(),
  new UserController(),
]

export const start = logger.wrap(async function start(): Promise<void> {
  try {
    graffiti()
    envVarCheck()
    listen(middlewares, controllers, port)
  } catch (e) {
    logger.fatal((e as Error).message)
    process.exit(1)
  }
})

/**
 * If the file is being run directly, start the Recipe.Report API now.
 *
 * ```bash
 * node dist/recipereport.js
 * ```
 */
if (require.main === module) {
  start()
}
