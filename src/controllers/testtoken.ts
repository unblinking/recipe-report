/**
 * The test controller and routes.
 * Create an Expressjs controller and initialize the routes.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import expressjs, { Request, Response } from 'express'
/** Internal imports. */
import Controller from '../interfaces/controller'
import Responder from '../services/responder'

/**
 * Test the tokenwall middleware.
 *
 * @class TestToken
 * @implements {Controller}
 */
class TestToken implements Controller {
  /**
   * The Expressjs router for this controller.
   *
   * @public
   * @type {expressjs.Router}
   * @memberof TestToken
   */
  public router: expressjs.Router = expressjs.Router()

  /**
   * Path for this controller.
   *
   * @private
   * @type {string}
   * @memberof TestToken
   */
  private path: string = '/testtoken'

  /**
   * Instantiate the TestToken controller.
   * @memberof TestToken
   */
  constructor() {
    this.initRoutes()
  }

  /**
   * Initialize the routes for this controller.
   *
   * @public
   * @memberof TestToken
   */
  public initRoutes = (): void => {
    this.router.get(this.path, this.success)
  }

  /**
   * Welcome my son, Welcome to the machine.
   *
   * @private
   * @memberof TestToken
   */
  private success = (_req: Request, res: Response): void => {
    const respond = new Responder()
    respond.success(res, {
      message: `Welcome to the team, DZ-something-something.`,
    })
  }

  // TODO: This is supposed to be for testing the tokenwall middleware.
  // Need to finish setting up the encryption stuff and JWT so that it
  // can be tested here.
}

export default TestToken
