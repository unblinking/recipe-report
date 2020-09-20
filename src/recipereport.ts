/**
 * Recipe.Report.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import { RequestHandler } from 'express'
import * as BodyParser from 'body-parser'
import Helmet from 'helmet'
/** Internal imports. */
import App from './app'
import CallHistory from './middlewares/callhistory'
import Controller from './interfaces/controller'
import Root from './controllers/root'
import TestToken from './controllers/testtoken'
import NotFound from './controllers/notfound'
import Logger from './services/logger'
import Fun from './services/fun'

/**
 * Interface for the Recipe.Report application.
 *
 * @interface Starter
 */
interface Starter {
  /**
   * Recipe.Report application starter.
   *
   * @returns {Promise<void>}
   * @memberof Starter
   */
  start(): Promise<void>
}

/**
 * Recipe.Report application.
 *
 * @class RecipeReport
 * @implements {Starter}
 */
class RecipeReport implements Starter {
  // TODO: Verify required environment vars are set.

  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof RecipeReport
   */
  private logger: Logger = new Logger()

  /**
   * Call history logging service.
   *
   * @private
   * @type {CallHistory}
   * @memberof RecipeReport
   */
  private callHistory: CallHistory = new CallHistory()

  /**
   * Fun service.
   *
   * @private
   * @type {Fun}
   * @memberof RecipeReport
   */
  private fun: Fun = new Fun()

  /**
   * Port used by the Expressjs {@link https://expressjs.com/en/4x/api.html#app.listen app.listen} method.
   *
   * @private
   * @type {number}
   * @memberof RecipeReport
   */
  private port: number = parseInt(process.env.PORT ?? '', 10)

  /**
   * Middleware functions.
   *
   * @private
   * @type {Array<RequestHandler>}
   * @memberof RecipeReport
   */
  private middlewares: Array<RequestHandler> = [
    Helmet(),
    BodyParser.json(),
    BodyParser.urlencoded({ extended: true }),
    this.callHistory.log,
  ]

  /**
   * Controllers.
   *
   * @private
   * @type {Array<Controller>}
   * @memberof RecipeReport
   */
  private controllers: Array<Controller> = [
    new Root(),
    new TestToken(),
    new NotFound(),
  ]

  /**
   * Expressjs application wrapper.
   *
   * @private
   * @type {App}
   * @memberof RecipeReport
   */
  private app: App = new App(this.port, this.middlewares, this.controllers)

  /**
   * Recipe.Report application starter. Start listening for connections.
   *
   * @public
   * @memberof RecipeReport
   */
  public start = async (): Promise<void> => {
    try {
      await this.app.listenWrapper()
      await this.fun.tag()
    } catch (error) {
      this.logger.write(error)
      process.exit(1)
    }
  }
}

/**
 * If the file is being run directly, start the Recipe.Report API now.
 *
 * ```bash
 * node dist/recipereport.js
 * ```
 */
if (require.main === module) {
  try {
    const recipeReport = new RecipeReport()
    recipeReport.start()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default RecipeReport
