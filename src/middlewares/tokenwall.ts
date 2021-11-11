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

import { Request, Response, NextFunction } from 'express'

import { logger } from '../wrappers/log'
import { Payload, decodeToken, tokenType } from '../wrappers/token'
import { Responder } from '../services/responder-service'
import { httpStatus, errMessage } from '../constants'

export interface RequestWithUser extends Request {
  userId?: string
}

export const tokenwall = (
  req: RequestWithUser,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token: string = req.headers.token as string
    if (!token) throw new Error(errMessage.TOKENWALL_UNDEFINED)
    const payload: Payload = decodeToken(token)

    // Verify that the token is for access.
    if (payload.type !== tokenType.ACCESS)
      throw new Error(errMessage.TOKENWALL_TYPE)

    // Verify that the token hasn't expired.
    const now = new Date().getTime()
    if (payload.ttl < now) throw new Error(errMessage.TOKENWALL_EXPIRED)

    // Add the user Id from the payload to the request.
    const userId: string = payload.id
    req.userId = userId

    // Allow the request to continue on.
    next()
  } catch (e) {
    logger.warn(`Tokenwall error. ${(e as Error).message}`)
    const data = {
      errorName: `401 Unauthorized`,
      errorMessage: (e as Error).message,
    }
    const responder: Responder = new Responder(httpStatus.UNAUTHORIZED)
    responder.fail(_res, data)
  }
}
