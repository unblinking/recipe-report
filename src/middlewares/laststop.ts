/**
 * Last stop middleware.
 * 404 and 500 error handling.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'

import Logger from '../services/log'
import { Responder } from '../services/responder'

class LastStop {
  private logger: Logger = new Logger()

  /**
   * Four, oh four! Not found, my dude.
   *
   * @public
   * @memberof LastStop
   */
  public fourOhFour = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    this.logger.write(`404 Not Found. ${req.method} ${req.path}`)
    const respond = new Responder(404)
    respond.error(res, `404 Not Found.`, `404`)
    next()
  }

  /**
   * Five hundred! Server error, my dude.
   *
   * @public
   * @memberof LastStop
   */
  public fiveHundred = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    this.logger.write(`500 Internal Server Error. ${req.method} ${req.path}`)
    const respond = new Responder(500)
    respond.error(res, `500 Internal Server Error`, `500`, {
      error: err.name,
      message: err.message,
    })
    next()
  }
}

export default LastStop
