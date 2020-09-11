/**
 * Logger service.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response } from 'express'

/**
 * Pencil interface definition. A pencil has a writer, and an eraser.
 * To be used in Expressjs middleware.
 * @param {Request} req HTTP req that Expressjs receives.
 * @param {Response} res HTTP res that Expressjs sends when it gets a req.
 * @param {Any} next The next middleware function.
 */
interface Pencil {
  // Write something down.
  writer(req: Request, res: Response, next: any): void
  // Erase something that has been written.
  eraser(req: Request, res: Response, next: any): void
}

/**
 * Logger service implementation.
 */
class Logger implements Pencil {
  /**
   * Write to the log.
   * @param {Request} req HTTP req that Expressjs receives.
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Any} next The next middleware function.
   */
  public writer(req: Request, _res: Response, next: any): void {
    console.log('Request:', req.method, req.path)
    next()
  }

  /**
   * Erase from the log.
   * @param {Request} req HTTP req that Expressjs receives.
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Any} next The next middleware function.
   */
  public eraser(_req: Request, _res: Response, next: any): void {
    next()
  }
}

export default Logger
