/**
 * The NotFound controller and routes.
 * Create an Expressjs controller and initialize the routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import expressjs from 'express'
import { Request, Response } from 'express'
/** Internal imports. */
import Controller from '../interfaces/controller'
import Logger from '../services/logger'
import Responder from '../services/responder'

/**
 * The NotFound controller and routes.
 *
 * @class NotFound
 * @implements {Controller}
 */
class NotFound implements Controller {
  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof CallHistory
   */
  private logger: Logger = new Logger()

  /**
   * The Expressjs router for this controller.
   *
   * @public
   * @type {expressjs.Router}
   * @memberof NotFound
   */
  public router: expressjs.Router = expressjs.Router()

  /**
   * Path for this controller.
   *
   * @private
   * @type {string}
   * @memberof NotFound
   */
  private path: string = '*'

  /**
   * Instantiate the NotFound controller.
   * @memberof NotFound
   */
  constructor() {
    this.initRoutes()
  }

  /**
   * Initialize the routes for this controller.
   *
   * @public
   * @memberof NotFound
   */
  public initRoutes = (): void => {
    this.router.get(this.path, this.notfound)
  }

  /**
   * 404 Not Found, my dude.
   *
   * @private
   * @memberof NotFound
   */
  private notfound = (req: Request, res: Response): void => {
    this.logger.write(
      `Request for a route that doesn't exist. ${req.method} ${req.path}`
    )
    const respond = new Responder(404)
    respond.fail(res, {
      message: `404 Not Found. The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.`,
    })
  }
}

export default NotFound
