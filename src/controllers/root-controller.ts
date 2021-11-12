/**
 * The root controller and routes.
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

import { fiveHundred } from '../middlewares/laststop'
import { success } from './helpers'
import { httpStatus, logMsg } from '../constants'

export class RootController implements IController {
  router: Router = Router()
  path: string = `/`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`/`, this.curtsy)
    this.router.use(fiveHundred)
  }

  private curtsy = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code = httpStatus.OK
      const welcomeMsg = `Welcome to the Recipe.Report API server. This is the root route. For documentation please go to https://docs.recipe.report/`
      success(res, code, logMsg.LOG_ROOT_SUCCESS, { message: welcomeMsg })
    } catch (err) {
      next(err)
    }
  }
}
