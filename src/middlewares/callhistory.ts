/**
 * CallHistory middleware.
 * Keep a history of all API calls.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'

import Logger from '../services/log'

/**
 * Call history for API calls.
 *
 * @class CallHistory
 */
export class CallHistory {
  logger: Logger = new Logger()

  /**
   * Write an API call event to the general log.
   *
   * @public
   * @memberof CallHistory
   */
  public log = (req: Request, _res: Response, next: NextFunction): void => {
    const callDetails = `Request: ${req.method} ${req.path}`
    this.logger.write(callDetails)
    next()
  }
}
