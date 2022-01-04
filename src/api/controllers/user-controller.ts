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
import { NextFunction, Response, Router } from 'express'
import { inject, injectable } from 'inversify'

import { Err, errUser, isErrClient } from 'domain/models/err-model'
import { StringRequest, UserRequest, UuidRequest } from 'domain/service/service-requests'

import { httpStatus, logMsg, outcomes } from 'data/constants'

import { log } from 'service/log-service'
import { IUserService } from 'service/user-service'

import { IBaseController } from 'api/controllers/base-controller'
import { error, fail, success } from 'api/controllers/controller-response'
import { fiveHundred } from 'api/middlewares/laststop'
import { RequestWithUser, tokenwall } from 'api/middlewares/tokenwall'

import { SYMBOLS } from 'root/symbols'

@injectable()
export class UserController implements IBaseController {
  private _userService: IUserService
  router: Router = Router()
  path: string = `/v1/users`

  public constructor(@inject(SYMBOLS.IUserService) userService: IUserService) {
    this._userService = userService
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/`, this.create)
    this.router.get(`/:id`, tokenwall, this.read)
    this.router.put(`/:id`, tokenwall, this.update)
    this.router.delete(`/:id`, tokenwall, this.delete)
    this.router.post(`/session`, this.authenticate)
    this.router.put(`/activation/:token`, this.activate)
    this.router.use(fiveHundred) // Error handling.
  }

  private create = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts create()`)
    try {
      const svcReq = UserRequest.create({ ...req.body })
      const svcRes = await this._userService.create(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS, { user: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errUser.CREATE, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errUser.CREATE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }

  private read = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    log.trace(`user-controller.ts read()`)
    try {
      const svcReq = UuidRequest.create(req.params.id, req.authorizedId)
      const svcRes = await this._userService.read(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS, { user: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errUser.READ, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errUser.READ} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }

  private update = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts update()`)
    try {
      const svcReq = UserRequest.create({ ...req.body }, req.authorizedId)
      const svcRes = await this._userService.update(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS, { user: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errUser.UPDATE, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errUser.UPDATE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }

  private delete = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts delete()`)
    try {
      const svcReq = UuidRequest.create(req.params.id, req.authorizedId)
      const svcRes = await this._userService.delete(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS, { user: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errUser.DELETE, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errUser.DELETE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }

  private activate = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts activate()`)
    try {
      const svcReq = StringRequest.create(req.params.token)
      const svcRes = await this._userService.activate(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_ACTIVATE_SUCCESS, { user: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errUser.ACTIVATE, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errUser.ACTIVATE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }

  private authenticate = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`user-controller.ts authenticate()`)
    try {
      const svcReq = UserRequest.create({ ...req.body })
      const svcRes = await this._userService.authenticate(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_AUTHENTICATE_SUCCESS, { token: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errUser.AUTHENTICATE, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errUser.AUTHENTICATE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }
}
