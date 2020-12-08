/**
 * The root controller and routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder'

export class RootController implements IController {
  router: Router = Router()
  path: string = `/`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`${this.path}`, this.curtsy)
  }

  private curtsy = async (req: Request, res: Response): Promise<void> => {
    const respond = new Responder()
    respond.success(res, {
      message: 'Welcome to the Recipe.Report API server.',
      headers: req.headers,
    })
  }
}
