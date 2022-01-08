/**
 * The role controller and routes.
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

import { Err, errRole, isErrClient } from 'domain/models/err-model'
import { RoleRequest } from 'domain/service/service-requests'

import { httpStatus, logMsg, outcomes } from 'data/constants'

import { IBaseController } from 'api/controllers/base-controller'
import { error, fail, success } from 'api/controllers/controller-response'
import { fiveHundred } from 'api/middlewares/laststop'
import { RequestWithUser, tokenwall } from 'api/middlewares/tokenwall'

import { log } from 'root/service/log-service'
import { IRoleService } from 'root/service/role-service'
import { SYMBOLS } from 'root/symbols'

@injectable()
export class RoleController implements IBaseController {
  private _roleService: IRoleService
  router: Router = Router()
  path: string = `/v1/roles`

  public constructor(@inject(SYMBOLS.IRoleService) roleService: IRoleService) {
    this._roleService = roleService
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/`, tokenwall, this.create)
    // this.router.get(`/:id`, tokenwall, this.read)
    // this.router.put(`/:id`, tokenwall, this.update)
    // this.router.delete(`/:id`, tokenwall, this.delete)
    this.router.use(fiveHundred) // Error handling.
  }

  private create = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    log.trace(`role-controller.ts create()`)
    try {
      const svcReq = RoleRequest.create({ ...req.body })
      const svcRes = await this._roleService.create(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          success(res, code, logMsg.LOG_REG_SUCCESS, { user: svcRes.item })
          break
        case outcomes.FAIL:
          fail(res, code, svcRes.err?.message, { message: svcRes.err?.message })
          break
        default:
          error(errRole.CREATE, res, code, svcRes.err?.message)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      if (isErrClient(err.name)) {
        // If the error message can be client facing, return BAD_REQUEST.
        err.message = `${errRole.CREATE} ${err.message}`
        fail(res, httpStatus.BAD_REQUEST, err.message, { message: err.message })
      } else {
        // Do not leak internal error details, return INTERNAL_ERROR.
        next(err)
      }
    }
  }
}
