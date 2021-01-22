/**
 * The testtoken controller and routes.
 * A simple test to make sure the tokenwall filter middleware is working.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder-service'
import { tokenwall } from '../middlewares/tokenwall'
import { fiveHundred } from '../middlewares/laststop'

interface RequestWithUser extends Request {
  userId?: string
}

export class TestTokenController implements IController {
  router: Router = Router()
  path: string = `/testtoken`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`/`, tokenwall, this.success)
    this.router.use(fiveHundred)
  }

  private success = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const respond = new Responder()
      respond.success(res, {
        message: `Welcome to the team, DZ-${req.userId}.`,
      })
    } catch (err) {
      next(err)
    }
  }
}
