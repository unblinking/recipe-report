/**
 * CallHistory service.
 * Keep a history of all API calls.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'
import Logger from '../services/logger'

/**
 * Logger service implementation.
 */
class CallHistory {
  private logger: Logger = new Logger()

  /**
   * Write an API call event to the general log.
   * @param {Request} req HTTP req that Expressjs receives.
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Any} next The next middleware function.
   */
  public log(req: Request, _res: Response, next: NextFunction): void {
    const callDetails = `Request: ${req.method} ${req.path}`
    this.logger.write(callDetails)
    next()
  }
}

export default CallHistory
