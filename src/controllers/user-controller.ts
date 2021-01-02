/**
 * The user controller and routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder-service'
import { fiveHundred } from '../middlewares/laststop'
import { UserRegistrationRequest } from '../db/models/service-requests'
import { UserService } from '../services/user-service'

export class UserController implements IController {
  router: Router = Router()
  path: string = `/user`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/register`, this.register)
    this.router.get(`/activate:token`, this.notimplemented)
    this.router.post(`/login`, this.notimplemented)
    this.router.use(fiveHundred)
  }

  private notimplemented = (
    _req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const respond = new Responder(501)
      respond.error(res, `501 Not Implemented`, `501`)
    } catch (err) {
      next(err)
    }
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserRegistrationRequest(
        req.body.username,
        req.body.email_address,
        req.body.password
      )
      const userService = new UserService()
      const serviceResponse = await userService.register(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res)
      } else {
        respond.error(res, `Error registering user`, `500`)
      }
    } catch (err) {
      next(err)
    }
  }
}
