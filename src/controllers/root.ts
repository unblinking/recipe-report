/**
 * The root controller and routes.
 * Create an Expressjs controller and initialize the routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import expressjs, { Request, Response } from 'express'
/** Internal imports. */
import Controller from '../interfaces/controller'
import Responder from '../services/responder'

/**
 * The root controller and routes.
 *
 * @class Root
 * @implements {Controller}
 */
class Root implements Controller {
  /**
   * The Expressjs router for this controller.
   *
   * @public
   * @type {expressjs.Router}
   * @memberof Root
   */
  public router: expressjs.Router = expressjs.Router()

  /**
   * Path for this controller.
   *
   * @private
   * @type {string}
   * @memberof Root
   */
  private path: string = '/'

  /**
   * Instantiate the root controller.
   * @memberof Root
   */
  constructor() {
    this.initRoutes()
  }

  /**
   * Initialize the routes for this controller.
   *
   * @public
   * @memberof Root
   */
  public initRoutes = (): void => {
    this.router.get(this.path, this.curtsy)
  }

  /**
   * Curtsy when meeting the monarch.
   *
   * @private
   * @memberof Root
   */
  private curtsy = async (req: Request, res: Response): Promise<void> => {
    const respond = new Responder()
    respond.success(res, {
      message: 'Welcome to the Recipe.Report API server.',
      headers: req.headers,
    })
  }
}

export default Root
