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
import { inject, injectable } from 'inversify'

import { errBase, logMsg, outcomes } from '../../data/constants'

import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from '../../domain/models/service-requests'

import { IUserService } from '../../service/user-service'

import { TYPES } from '../../types'
import { fiveHundred } from '../middlewares/laststop'
import { IBaseController } from './base-controller'
import { error, fail, success } from './controller-response'

@injectable()
export class UserController implements IBaseController {
  private _userService: IUserService
  router: Router = Router()
  path: string = `/v1/user`

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    this._userService = userService
    this.initRoutes()
  }

  public initRoutes = (): void => {
    // Root CRUD.
    this.router.post(`/`, this.register) // Create (new user)
    /* NOT IMPLEMENTED YET
    this.router.get(`/:id`, this.find) // Read (find user by id)
    this.router.put(`/:id`, this.update) // Update (update user by id)
    this.router.delete(`/:id`, this.delete) // Delete (delete user by id)
    */
    // Session.
    this.router.post(`/session`, this.authenticate) // Create (user session)
    // Activation.
    this.router.put(`/activation/:token`, this.activate) // Update (user activation status)
    // Errors.
    this.router.use(fiveHundred)
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const serviceRequest = new UserRegistrationRequest({ ...req.body })
      const serviceResponse = await this._userService.register(serviceRequest)
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS)
          break
        case outcomes.FAIL:
          fail(res, code, serviceResponse.err?.message, {
            message: serviceResponse.err?.message,
          })
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
    next: NextFunction,
  ): Promise<void> => {
    try {
      const serviceRequest = new UserActivationRequest({ ...req.params })
      const serviceResponse = await this._userService.activate(serviceRequest)
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_ACTIVATE_SUCCESS)
          break
        case outcomes.FAIL:
          fail(res, code, serviceResponse.err?.message, {
            message: serviceResponse.err?.message,
          })
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
    next: NextFunction,
  ): Promise<void> => {
    try {
      const serviceRequest = new UserAuthenticationRequest({ ...req.body })
      const serviceResponse = await this._userService.authenticate(
        serviceRequest,
      )
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_AUTHENTICATE_SUCCESS, {
            token: serviceResponse.item?.token,
          })
          break
        case outcomes.FAIL:
          fail(res, code, serviceResponse.err?.message, {
            message: serviceResponse.err?.message,
          })
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
