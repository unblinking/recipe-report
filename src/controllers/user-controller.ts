/**
 * The user controller and routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { NextFunction, Request, Response, Router } from 'express'

import { IController } from './interfaces'
import { Responder } from '../services/responder-service'
import { fiveHundred } from '../middlewares/laststop'
import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from '../db/models/service-requests'
import { UserService } from '../services/user-service'
import { logger } from 'bs-logger'

export class UserController implements IController {
  router: Router = Router()
  path: string = `/user`

  constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/register`, this.register)
    this.router.get(`/activate/:token`, this.activate)
    this.router.post(`/login`, this.authenticate)
    this.router.use(fiveHundred)
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserRegistrationRequest({ ...req.body })
      const userService = new UserService()
      const serviceResponse = await userService.register(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res)
      } else {
        logger.error(serviceResponse.error?.message as string)
        respond.error(res, `Error registering user`, `500`)
      }
    } catch (err) {
      next(err)
    }
  }

  private activate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserActivationRequest({ ...req.params })
      const userService = new UserService()
      const serviceResponse = await userService.activate(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res)
      } else {
        logger.error(serviceResponse.error?.message as string)
        respond.error(res, `Error activating user`, `500`)
      }
    } catch (err) {
      next(err)
    }
  }

  private authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const serviceRequest = new UserAuthenticationRequest({ ...req.body })
      const userService = new UserService()
      const serviceResponse = await userService.authenticate(serviceRequest)
      const respond = new Responder()
      if (serviceResponse.success === true) {
        respond.success(res, { token: serviceResponse.item?.token })
      } else {
        logger.error(serviceResponse.error?.message as string)
        respond.error(res, `Error authenticating user`, `500`)
      }
    } catch (err) {
      next(err)
    }
  }
}
