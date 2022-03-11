/**
 * Expressjs application wrapper.
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
import cors from 'cors'
import express, { Application, RequestHandler } from 'express'

import { IBaseController } from 'api/controllers/base-controller'
import { fiveHundred, fourOhFour } from 'api/middlewares/laststop'

import { log } from 'service/log-service'

export const listen = (
  middlewares: Array<RequestHandler>,
  controllers: Array<IBaseController>,
  port: number,
): void => {
  log.trace(`app.ts listen()`)

  // Instatiate our express.js web application with settings.
  const app: Application = express().set('json spaces', 2)

  // Use the express.js middleware to enable cross origin resource sharing.
  app.use(cors())

  // Use our middlewares. Middleware can be declared in an array.
  // @see {@link https://expressjs.com/en/guide/using-middleware.html Application-level middleware}
  app.use(middlewares)

  // Each controller will have a separate express.Router router instance. Each
  // of those is a complete middleware and routing system (mini-app). For more
  // info about this style of express.js router setup, see the following link.
  // @see {@link https://expressjs.com/en/guide/routing.html express.Router}
  controllers.forEach((controller: IBaseController) => {
    app.use(controller.path, controller.router)
  })

  // If none of the registered controllers were hit, reply 404 Not Found.
  // This is really our final application-level middleware.
  app.use(fourOhFour)

  // This error handling middleware doesn't really get used here much if ever.
  // Each controller uses it's own express.Router, which has its own router
  // stack, so every controller implements the error handling middleware at the
  // end of their own router stack. This is here just in case some error happens
  // that isn't inside of one of the controller's router stacks.
  app.use(fiveHundred)

  // Finally, start listening on the specified port.
  app.listen(port, () => {
    log.info(`Expressjs is listening on port ${port}`)
  })
}