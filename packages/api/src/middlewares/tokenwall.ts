/**
 * Tokenwall middleware (like a firewall).
 *
 * You shall not pass! Excepting, of course, with a valid token.
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
import { Responder } from '@recipe-report/api/controllers'
import { container, SYMBOLS } from '@recipe-report/api/ioc'
import { httpStatus } from '@recipe-report/data'
import { Err, errClient, isErrClient } from '@recipe-report/domain/models'
import { UniqueId } from '@recipe-report/domain/values'
import type { Claims, IJwtService } from '@recipe-report/service'
import { log, tokenType } from '@recipe-report/service'
import type { NextFunction, Request, Response } from 'express'

export interface RequestWithUser extends Request {
  authorizedId?: UniqueId
}

export const tokenwall = (req: RequestWithUser, _res: Response, next: NextFunction): void => {
  try {
    const authorization: string = req.headers.authorization as string
    const split = authorization.split(' ')
    if (split.length !== 2) {
      throw new Err('TOKEN_INVALID', errClient.TOKEN_INVALID)
    }
    const regex = /^Bearer$/i
    const authScheme = split[0]
    if (!authScheme || !regex.test(authScheme)) {
      throw new Err('TOKEN_INVALID', errClient.TOKEN_INVALID)
    }
    const token = split[1]
    if (!token) throw new Err(`TOKENWALL_UNDEF`, errClient.TOKENWALL_UNDEF)
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    const payload: Claims = jwt.decode(token)
    // Verify that the token is for access.
    if (payload.typ !== tokenType.ACCESS) {
      throw new Err(`TOKENWALL_TYPE`, errClient.TOKENWALL_TYPE)
    }
    // Add the user id from the payload subject claim to the request.
    req.authorizedId = UniqueId.create(payload.sub)
    // Allow the request to continue on.
    next()
  } catch (e) {
    // The caught e could be anything. Turn it into an Err.
    const err = Err.toErr(e)
    // Log the error.
    log.warn(`${err.name} ${err.message}`)
    // If the error message can be client facing, include error details.
    if (isErrClient(err.name)) {
      Responder.fail(_res, httpStatus.UNAUTHORIZED, err.message, err.name)
    } else {
      Responder.error(_res, httpStatus.UNAUTHORIZED)
    }
  }
}
