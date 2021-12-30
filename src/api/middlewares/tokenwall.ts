/**
 * Tokenwall middleware (like a firewall).
 *
 * You shall not pass! Excepting, of course, with a valid token.
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
import { NextFunction, Request, Response } from 'express'

import { Err, errClient } from 'domain/models/err-model'

import { httpStatus } from 'data/constants'

import { IJwtService, Payload, tokenType } from 'service/jwt-service'
import { log } from 'service/log-service'
import { Responder } from 'service/responder-service'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

export interface RequestWithUser extends Request {
  requestingUserId?: string
}

export const tokenwall = (req: RequestWithUser, _res: Response, next: NextFunction): void => {
  log.trace(`tokenwall.ts tokenwall()`)
  try {
    const token: string = req.headers.token as string
    if (!token) throw new Err(`TOKENWALL_UNDEF`, errClient.TOKENWALL_UNDEF)
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    const payload: Payload = jwt.decode(token)

    // Verify that the token is for access.
    if (payload.type !== tokenType.ACCESS) {
      throw new Err(`TOKENWALL_TYPE`, errClient.TOKENWALL_TYPE)
    }
    // Verify that the token hasn't expired.
    const now = new Date().getTime()
    if (payload.ttl < now) {
      throw new Err(`TOKENWALL_EXP`, errClient.TOKENWALL_EXP)
    }

    // Add the user Id from the payload to the request.
    req.requestingUserId = payload.id

    // Allow the request to continue on.
    next()
  } catch (e) {
    log.warn(`Tokenwall error. ${(e as Err).message}`)
    const data = {
      errorName: `401 Unauthorized`,
      errorMessage: (e as Err).message,
    }
    const responder: Responder = new Responder(httpStatus.UNAUTHORIZED)
    responder.fail(_res, data)
  }
}
