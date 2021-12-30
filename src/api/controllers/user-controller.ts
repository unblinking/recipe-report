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

import { Err, errUser, isErrClient } from 'domain/models/err-model'
import {
  // UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from 'domain/service/service-requests'

import { httpStatus, logMsg, outcomes } from 'data/constants'

import { log } from 'service/log-service'
import { IUserService } from 'service/user-service'

import { IBaseController } from 'api/controllers/base-controller'
import { error, fail, success } from 'api/controllers/controller-response'
import { fiveHundred } from 'api/middlewares/laststop'

import { SYMBOLS } from 'root/symbols'

@injectable()
export class UserController implements IBaseController {
  private _userService: IUserService
  router: Router = Router()
  path: string = `/v1/user`

  public constructor(@inject(SYMBOLS.IUserService) userService: IUserService) {
    this._userService = userService
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/`, this.create) // Create user
    /* NOT IMPLEMENTED YET
    this.router.get(`/:id`, this.find) // Read user
    this.router.put(`/:id`, this.update) // Update user
    this.router.delete(`/:id`, this.delete) // Delete user
    */
    this.router.post(`/session`, this.authenticate) // Create session
    // this.router.put(`/activation/:token`, this.activate) // Update user activation status
    this.router.use(fiveHundred) // Error handling.
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts register()`)
    try {
      const serviceRequest = UserRegistrationRequest.create({
        ...req.body,
      })
      const serviceResponse = await this._userService.create(serviceRequest)
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
          error(errUser.REGISTER, res, code, serviceResponse.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        err.message = `${errUser.REGISTER} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        next(err)
      }
    }
  }

  /*
  private activate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts activate()`)
    try {
      const serviceRequest = UserActivationRequest.create({
        token: req.params.token,
      })
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
  */

  private authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts authenticate()`)
    try {
      const serviceRequest = UserAuthenticationRequest.create({ ...req.body })
      const serviceResponse = await this._userService.authenticate(
        serviceRequest,
      )
      const code = serviceResponse.statusCode
      switch (serviceResponse.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_AUTHENTICATE_SUCCESS, {
            token: serviceResponse.item,
          })
          break
        case outcomes.FAIL:
          fail(res, code, serviceResponse.err?.message, {
            message: serviceResponse.err?.message,
          })
          break
        default:
          error(errUser.AUTHENTICATE, res, code, serviceResponse.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        err.message = `${errUser.AUTHENTICATE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        next(err)
      }
    }
  }
}
