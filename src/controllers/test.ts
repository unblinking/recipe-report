/**
 * The test controller and routes.
 * Create an Expressjs controller and initialize the routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import expressjs from 'express'
import { Request, Response } from 'express'
import Controller from '../interfaces/controller'
import Responder from '../services/responder'

// The test controller and routes.
class Test implements Controller {
  constructor() {
    this.initRoutes()
  }

  // The Expressjs router for this controller.
  public router: expressjs.Router = expressjs.Router()

  // Path for this controller.
  private path: string = '/test'

  // Initialize the routes for this controller.
  public initRoutes(): void {
    this.router.get(this.path, this.success)
  }

  // Welcome my son, Welcome to the machine.
  private success = (_req: Request, res: Response): void => {
    const respond = new Responder()
    respond.success(res, {
      message: `Welcome to the team, DZ-something-something.`,
    })
  }
}

export default Test
