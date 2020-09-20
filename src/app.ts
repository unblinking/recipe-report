/**
 * Expressjs application wrapper.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import Expressjs from 'express'
import { RequestHandler } from 'express'
/** Internal imports. */
import Controller from './interfaces/controller'
import Logger from './services/logger'

/**
 * Interface for the Expressjs application wrapper.
 *
 * @interface ExpressWrapper
 */
interface ExpressWrapper {
  /**
   * Expressjs {@link https://expressjs.com/en/4x/api.html#app.listen app.listen} method wrapper.
   *
   * @returns {Promise<unknown>}
   * @memberof ExpressWrapper
   */
  listenWrapper(): Promise<unknown>
}

/**
 * Expressjs application wrapper.
 *
 * @class App
 * @implements {ExpressWrapper}
 */
class App implements ExpressWrapper {
  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof App
   */
  private logger: Logger = new Logger()

  /**
   * Port used by the Expressjs {@link https://expressjs.com/en/4x/api.html#app.listen app.listen} method.
   *
   * @private
   * @type {number}
   * @memberof App
   */
  private port: number = 0

  /**
   * Expressjs web application.
   *
   * @private
   * @type {Expressjs.Application}
   * @memberof App
   */
  private expressApplication: Expressjs.Application = Expressjs()

  /**
   * Instantiate the application.
   *
   * @param {number} port
   * @param {Array<RequestHandler>} middlewares
   * @param {Array<Controller>} controllers
   * @memberof App
   */
  constructor(
    port: number,
    middlewares: Array<RequestHandler>,
    controllers: Array<Controller>
  ) {
    this.port = port
    this.middlewares(middlewares)
    this.controllers(controllers)
  }

  /**
   * Mount the specified middleware functions.
   *
   * @private
   * @memberof App
   * {@link https://expressjs.com/en/4x/api.html#app.use app.use}
   */
  private middlewares = (middlewares: Array<RequestHandler>): void => {
    this.expressApplication.use(middlewares)
  }

  /**
   * Mount the specified controller routes at the root path ("/").
   *
   * @private
   * @memberof App
   * {@link https://expressjs.com/en/4x/api.html#app.use app.use}
   */
  private controllers = (controllers: Array<Controller>): void => {
    controllers.forEach((controller: Controller) => {
      this.expressApplication.use('/', controller.router)
    })
  }

  /**
   * Starts a UNIX socket and listens for connections on the specified path.
   *
   * @public
   * @memberof App
   * {@link https://expressjs.com/en/4x/api.html#app.listen app.listen}
   */
  public listenWrapper = (): Promise<unknown> => {
    const promise = new Promise((resolve) => {
      this.expressApplication.listen(this.port, () => {
        this.logger.write(`Expressjs is listening on port ${this.port}`)
        resolve()
      })
    })
    return promise
  }
}

export default App
