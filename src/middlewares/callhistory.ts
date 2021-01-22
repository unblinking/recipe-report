/**
 * CallHistory middleware.
 * Keep a history of all API calls.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'
import { logger } from '../wrappers/log'

/**
 * Call history for API calls.
 */
export const callHistory = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  logger.info(`Request: ${req.method} ${req.path}`)
  next()
}
