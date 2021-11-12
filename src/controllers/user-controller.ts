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
 *
 * @module
 */

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'

import { fiveHundred } from '../middlewares/laststop'
import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from '../db/models/service-requests'
import { UserService } from '../services/user-service'
import { success, fail, error } from './helpers'
import { errBase, logMsg, outcomes } from '../constants'

export class UserController implements IController {
  router: Router = Router()
  path: string = `/v1/user`

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
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS)
          break
        case outcomes.FAIL:
          const errMsg = serviceResponse.err?.message
          fail(res, code, errMsg, { message: errMsg })
          break
        default:
          error(errBase.REG, res, code, serviceResponse.err?.message)
          break
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
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_ACTIVATE_SUCCESS)
          break
        case outcomes.FAIL:
          const errMsg = serviceResponse.err?.message
          fail(res, code, errMsg, { message: errMsg })
          break
        default:
          error(errBase.ACTIVATE, res, code, serviceResponse.err?.message)
          break
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
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_AUTHENTICATE_SUCCESS, {
            token: serviceResponse.item?.token,
          })
          break
        case outcomes.FAIL:
          const errMsg = serviceResponse.err?.message
          fail(res, code, errMsg, { message: errMsg })
          break
        default:
          error(errBase.AUTH, res, code, serviceResponse.err?.message)
          break
      }
    } catch (err) {
      next(err)
    }
  }
}
