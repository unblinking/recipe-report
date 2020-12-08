/**
 * Expressjs application wrapper.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import Expressjs, { ErrorRequestHandler, RequestHandler } from 'express'
/** Internal imports. */
import { IController } from './controllers/interfaces'
import Logger from './services/log'

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
  private expressApplication: Expressjs.Application = Expressjs().set(
    'json spaces',
    2
  )

  /**
   * Instantiate the application. Set the port, the middlewares, the
   * controllers, then at the end set the 404 and 500 handling.
   *
   * @param {number} port
   * @param {Array<RequestHandler>} middlewares
   * @param {Array<Controller>} controllers
   * @param {RequestHandler} fourOhFour
   * @param {ErrorRequestHandler} fiveHundred
   * @memberof App
   */
  constructor(
    port: number,
    middlewares: Array<RequestHandler>,
    controllers: Array<IController>,
    fourOhFour: RequestHandler,
    fiveHundred: ErrorRequestHandler
  ) {
    this.port = port
    this.middlewares(middlewares)
    this.controllers(controllers)
    this.fourOhFour(fourOhFour)
    this.fiveHundred(fiveHundred)
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
  private controllers = (controllers: Array<IController>): void => {
    controllers.forEach((controller: IController) => {
      this.expressApplication.use('/', controller.router)
    })
  }

  /**
   * Mount the specified fourOhFour handler middleware function.
   *
   * @private
   * @memberof App
   */
  private fourOhFour = (fourOhFour: RequestHandler): void => {
    this.expressApplication.use(fourOhFour)
  }

  /**
   * Mount the specified fiveHundred handler middleware function.
   *
   * @private
   * @memberof App
   */
  private fiveHundred = (fiveHundred: ErrorRequestHandler): void => {
    this.expressApplication.use(fiveHundred)
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
