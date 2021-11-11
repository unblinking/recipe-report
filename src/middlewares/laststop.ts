/**
 * Last stop middleware. 404 and 500 error handling.
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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from 'express'

import { logger } from '../wrappers/log'
import { Responder } from '../services/responder-service'
import { httpStatus, errMessage } from '../constants'

/**
 * Four, oh four! Not found, my dude.
 */
export const fourOhFour = (
  req: Request,
  _res: Response,
  _next: NextFunction
): void => {
  logger.info(`${errMessage.LASTSTOP_404} ${req.method} ${req.path}`)
  const respond = new Responder(httpStatus.NOT_FOUND)
  respond.fail(_res, errMessage.LASTSTOP_404)
  // I do not pass the error along to next(err) here on purpose.
  // We already handled the 404 Not Found as much as we want to.
  // We already sent headers to the client, so even if we were to pass the error
  // to our custom error handler, it would just pass it to the express built-in
  // error handler, and we don't want to do that.
}

/**
 * Five hundred! Custom error handling middleware.
 */
// Because this API is built with separate express.Router router instances, this
// error handling middleware must be used at the end of every controller/router.
export const fiveHundred = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`${errMessage.LASTSTOP_500} ${err.name} ${err.message}`)
  // Cannot set headers after they are sent to the client!
  // https://expressjs.com/en/guide/error-handling.html
  // If you call next() with an error after you have started writing the
  // response (for example, if you encounter an error while streaming the
  // response to the client) the Express default error handler closes the
  // connection and fails the request. So when you add a custom error handler,
  // you must delegate to the default Express error handler, when the headers
  // have already been sent to the client:
  if (res.headersSent) {
    return next(err)
  }
  // Ok, now we can delegate to our custom error handling.
  // For security, do not provide any internal error details.
  // Be vague here on purpose.
  const respond = new Responder(httpStatus.INTERNAL_ERROR)
  respond.error(res, errMessage.LASTSTOP_500, httpStatus.INTERNAL_ERROR)
}
