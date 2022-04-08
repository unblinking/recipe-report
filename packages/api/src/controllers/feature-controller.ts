/**
 * The feature controller and routes.
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
import type { IBaseController } from '@recipe-report/api/controllers'
import { Responder } from '@recipe-report/api/controllers'
import { SYMBOLS } from '@recipe-report/api/ioc'
import type { RequestWithUser } from '@recipe-report/api/middlewares'
import { fiveHundred, tokenwall } from '@recipe-report/api/middlewares'
import { httpStatus, outcomes } from '@recipe-report/data'
import { Err, errClient, isErrClient } from '@recipe-report/domain/models'
import { FeatureRequest, UuidRequest } from '@recipe-report/domain/services'
import type { IFeatureService } from '@recipe-report/service'
import type { NextFunction, Response } from 'express'
import { Router } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class FeatureController implements IBaseController {
  private _featureService: IFeatureService
  router: Router = Router()
  path: string = `/v1/features`

  public constructor(@inject(SYMBOLS.IFeatureService) featureService: IFeatureService) {
    this._featureService = featureService
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/`, tokenwall, this.create)
    this.router.get(`/:id`, tokenwall, this.read)
    this.router.put(`/:id`, tokenwall, this.update)
    this.router.delete(`/:id`, tokenwall, this.delete)
    this.router.use(fiveHundred) // Error handling.
  }

  private create = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const svcReq = FeatureRequest.create({ ...req.body })
      const svcRes = await this._featureService.create(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { feature: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.FEATURE_CREATE} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }

  private read = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.params['id']) {
        throw new Err('UID_INVALID', errClient.UID_INVALID)
      }
      const svcReq = UuidRequest.create(req.params['id'], req.authorizedId)
      const svcRes = await this._featureService.read(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { feature: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.FEATURE_READ} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }

  private update = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.params['id'] !== req.body.id) {
        throw new Err(`ID_MISMATCH`, errClient.ID_MISMATCH)
      }
      const svcReq = FeatureRequest.create({ ...req.body }, req.authorizedId)
      const svcRes = await this._featureService.update(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { feature: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.FEATURE_UPDATE} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }

  private delete = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.params['id']) {
        throw new Err('UID_INVALID', errClient.UID_INVALID)
      }
      const svcReq = UuidRequest.create(req.params['id'], req.authorizedId)
      const svcRes = await this._featureService.delete(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { feature: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.FEATURE_DELETE} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }
}
