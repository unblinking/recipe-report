/**
 * The testtoken controller and routes.
 *
 * This is a controller and routes that can be used as a simple test to make
 * sure the tokenwall filter middleware is working.
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

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder-service'
import { tokenwall } from '../middlewares/tokenwall'
import { fiveHundred } from '../middlewares/laststop'
import { httpStatus } from '../constants'

export interface RequestWithUser extends Request {
  userId?: string
}

export class TokenController implements IController {
  router: Router = Router()
  path: string = `/v1/token`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`/test`, tokenwall, this.test) // Token required.
    this.router.use(fiveHundred)
  }

  private test = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const respond = new Responder(httpStatus.OK)
      respond.success(res, {
        message: `Welcome to the team, DZ-${req.userId}.`,
      })
    } catch (err) {
      next(err)
    }
  }
}
