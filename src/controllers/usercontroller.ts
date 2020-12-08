/**
 * The user controller and routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, Router } from 'express'
import { IController } from './interfaces'
import { Responder } from '../services/responder'

export class UserController implements IController {
  router: Router = Router()
  path: string = `/user`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`${this.path}`, this.notimplemented)
  }

  private notimplemented = (_req: Request, res: Response): void => {
    const respond = new Responder(501)
    respond.error(res, `501 Not Implemented`, `501`)
  }

  /*
  private createUser = async

  private getUserById = async (req: Request, res: Response): Promise<void> => {
    const respond = new Responder()

    // Use a user service which hits the user repository to get the user.

    // Send the response back with the user record.

    respond.success(res, {
      user: userRecord
    })
  }
  */
}
