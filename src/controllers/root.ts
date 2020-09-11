/**
 * The root controller and routes.
 * Create an Expressjs controller and initialize the routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import expressjs from 'express'
import { Request, Response } from 'express'
import Controller from '../interfaces/controller'
import Responder from '../services/responder'

// The root controller and routes.
class Root implements Controller {
  constructor() {
    this.initRoutes()
  }

  // The Expressjs router for this controller.
  private router: expressjs.Router = expressjs.Router()

  // Path for this controller.
  private path: string = '/'

  // Initialize the routes for this controller.
  public initRoutes() {
    this.router.get(this.path, this.curtsy)
  }

  // Curtsy when meeting the monarch.
  private curtsy = (req: Request, res: Response): void => {
    const respond = new Responder()
    respond.success(res, {
      message: 'Welcome to the Recipe.Report API server.',
      headers: req.headers,
    })
  }
}

export default Root
