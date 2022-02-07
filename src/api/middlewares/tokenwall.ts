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
import { NextFunction, Request, Response } from 'express'

import { Err, errClient, isErrClient } from 'domain/models/err-model'
import { UniqueId } from 'domain/value/uid-value'

import { httpStatus } from 'data/constants'

import { Claims, IJwtService, tokenType } from 'service/jwt-service'
import { log } from 'service/log-service'

import { Responder } from 'api/responder'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

export interface RequestWithUser extends Request {
  authorizedId?: UniqueId
}

export const tokenwall = (req: RequestWithUser, _res: Response, next: NextFunction): void => {
  log.trace(`tokenwall.ts tokenwall()`)
  try {
    const authorization: string = req.headers.authorization as string
    const split = authorization.split(' ')
    if (split.length !== 2) {
      throw new Err('TOKEN_INVALID', errClient.TOKEN_INVALID)
    }
    const regex = /^Bearer$/i
    const authScheme = split[0]
    if (!regex.test(authScheme)) {
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
    // Add the user Id from the payload to the request.
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
