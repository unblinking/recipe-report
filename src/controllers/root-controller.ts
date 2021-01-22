/**
 * The root controller and routes.
 *
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder-service'
import { fiveHundred } from '../middlewares/laststop'

export class RootController implements IController {
  router: Router = Router()
  path: string = `/`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`/`, this.curtsy)
    this.router.use(fiveHundred)
  }

  private curtsy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const respond = new Responder()
      respond.success(res, {
        message: 'Welcome to the Recipe.Report API server.',
        request_headers: req.headers,
      })
    } catch (err) {
      next(err)
    }
  }
}
