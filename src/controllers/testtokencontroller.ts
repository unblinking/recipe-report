/**
 * The testtoken controller and routes.
 * A simple test to make sure the tokenwall filter middleware is working.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, Router } from 'express'
import { IController } from './interfaces'
import { TokenWall } from '../middlewares/tokenwall'
import { Responder } from '../services/responder'

export class TestTokenController implements IController {
  router: Router = Router()
  path: string = `/testtoken`
  tokenwall = new TokenWall()

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`${this.path}`, this.tokenwall.filter, this.success)
  }

  private success = (_req: Request, res: Response): void => {
    const respond = new Responder()
    respond.success(res, {
      message: `Welcome to the team, DZ-something-something.`,
    })
  }
}
