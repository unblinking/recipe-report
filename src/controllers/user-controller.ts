/**
 * The user controller and routes.
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
 */

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder-service'
import { fiveHundred } from '../middlewares/laststop'
import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from '../db/models/service-requests'
import { UserService } from '../services/user-service'
import { logger } from 'bs-logger'

export class UserController implements IController {
  router: Router = Router()
  path: string = `/user`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/register`, this.register)
    this.router.get(`/activate/:token`, this.activate)
    this.router.post(`/login`, this.authenticate)
    this.router.use(fiveHundred)
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserRegistrationRequest({ ...req.body })
      const userService = new UserService()
      const serviceResponse = await userService.register(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res)
      } else {
        const serviceErrorMessage = serviceResponse.error?.message as string
        logger.error(serviceErrorMessage)
        respond.error(
          res,
          `Error registering user: ${serviceErrorMessage}`,
          `500`
        )
      }
    } catch (err) {
      next(err)
    }
  }

  private activate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserActivationRequest({ ...req.params })
      const userService = new UserService()
      const serviceResponse = await userService.activate(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res)
      } else {
        const serviceErrorMessage = serviceResponse.error?.message as string
        logger.error(serviceErrorMessage)
        respond.error(
          res,
          `Error activating user: ${serviceErrorMessage}`,
          `500`
        )
      }
    } catch (err) {
      next(err)
    }
  }

  private authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserAuthenticationRequest({ ...req.body })
      const userService = new UserService()
      const serviceResponse = await userService.authenticate(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res, { token: serviceResponse.item?.token })
      } else {
        const serviceErrorMessage = serviceResponse.error?.message as string
        logger.error(serviceErrorMessage)
        respond.error(
          res,
          `Error authenticating user: ${serviceErrorMessage}`,
          `500`
        )
      }
    } catch (err) {
      next(err)
    }
  }
}
