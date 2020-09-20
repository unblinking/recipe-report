/**
 * Base controller interface.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import { Router } from 'express'

/**
 * The base controller interface.
 *
 * @interface Controller
 */
interface Controller {
  /**
   * Initialize the routes of the controller.
   *
   * @memberof Controller
   */
  initRoutes(): void

  /**
   * The Expressjs router used in the controller.
   *
   * @type {Router}
   * @memberof Controller
   */
  router: Router
}

export default Controller
