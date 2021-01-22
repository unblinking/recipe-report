/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Last stop middleware.
 * 404 and 500 error handling.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'

import { logger } from '../wrappers/log'
import { Responder } from '../services/responder-service'

/**
 * Four, oh four! Not found, my dude.
 */
export const fourOhFour = logger.wrap(function fourOhFour(
  req: Request,
  _res: Response,
  _next: NextFunction
): void {
  const err = new Error(`Not Found`)
  logger.info(`404 Not Found. ${req.method} ${req.path}`)
  const respond = new Responder(404)
  respond.fail(_res, err.message)
  // I do not pass the error along to next(err) here on purpose.
  // We already handled the 404 Not Found as much as we want to.
  // We already sent headers to the client, so even if we were to pass the error
  // to our custom error handler, it would just pass it to the express built-in
  // error handler, and we don't want to do that.
})

/**
 * Five hundred! Custom error handling middleware.
 */
// This cannot be wrapped by the logger, or it will no longer work to catch
// the express errors. Also, because this API is built with separate
// express.Router router instances, this error handling middleware must be
// used at the end of every controller/router.
export const fiveHundred = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info(`500 Internal Server Error.`)
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
  const respond = new Responder(500)
  respond.error(res, `500 Internal Server Error`, `500`, {
    error: err.name,
    message: err.message,
  })
}
