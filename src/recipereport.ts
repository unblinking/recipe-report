/**
 * Recipe.Report.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import { ErrorRequestHandler, RequestHandler } from 'express'
import * as BodyParser from 'body-parser'
import Helmet from 'helmet'
import HerokuSslRedirect from 'heroku-ssl-redirect'
/** Internal imports. */
import App from './app'
import { CallHistory } from './middlewares/callhistory'
import { IController } from './controllers/interfaces'
import Fun from './services/fun'
import LastStop from './middlewares/laststop'
import Logger from './services/log'
import { RootController } from './controllers/rootcontroller'
import { TestTokenController } from './controllers/testtokencontroller'
import { UserController } from './controllers/usercontroller'

/**
 * Recipe.Report application.
 *
 * @class RecipeReport
 * @implements {Starter}
 */
export class RecipeReport {
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
   * Last stop middleware. Handle 404 and 500 errors.
   *
   * @private
   * @type {LastStop}
   * @memberof RecipeReport
   */
  private lastStop: LastStop = new LastStop()

  /**
   * Port used by the Expressjs {@link https://expressjs.com/en/4x/api.html#app.listen app.listen} method.
   *
   * @private
   * @type {number}
   * @memberof RecipeReport
   */
  private port: number = parseInt(process.env.EXPRESS_PORT ?? ``, 10)

  /**
   * Middleware functions.
   *
   * @private
   * @type {Array<RequestHandler>}
   * @memberof RecipeReport
   */
  private middlewares: Array<RequestHandler> = [
    Helmet({
      contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
      referrerPolicy: { policy: 'same-origin' },
    }),
    HerokuSslRedirect(),
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
  private controllers: Array<IController> = [
    new RootController(),
    new TestTokenController(),
    new UserController(),
  ]

  /**
   * 404 Not Found middleware function.
   *
   * @private
   * @type {RequestHandler}
   * @memberof RecipeReport
   */
  private fourOhFour: RequestHandler = this.lastStop.fourOhFour

  /**
   * 500 Internal Server Error middleware function.
   *
   * @private
   * @type {ErrorRequestHandler}
   * @memberof RecipeReport
   */
  private fiveHundred: ErrorRequestHandler = this.lastStop.fiveHundred

  /**
   * Expressjs application wrapper.
   *
   * @private
   * @type {App}
   * @memberof RecipeReport
   */
  private app: App = new App(
    this.port,
    this.middlewares,
    this.controllers,
    this.fourOhFour,
    this.fiveHundred
  )

  /**
   * Fun service.
   *
   * @private
   * @type {Fun}
   * @memberof RecipeReport
   */
  private fun: Fun = new Fun()

  /**
   * Environment variable check. If these environment variables haven't been set
   * then we can't run the application.
   *
   * @private
   * @memberof RecipeReport
   */
  private environmentVariablesExist = async (): Promise<unknown> => {
    const promise = new Promise((resolve, reject) => {
      let missing: string = ``
      if (process.env.EXPRESS_PORT === undefined) {
        missing = missing.concat(`\n EXPRESS_PORT`)
      }
      if (process.env.CRYPTO_KEY === undefined) {
        missing = missing.concat(`\n CRYPTO_KEY`)
      }
      if (process.env.CRYPTO_ALGO === undefined) {
        missing = missing.concat(`\n CRYPTO_ALGO`)
      }
      if (process.env.CRYPTO_IV_LENGTH === undefined) {
        missing = missing.concat(`\n CRYPTO_IV_LENGTH`)
      }
      if (process.env.JWT_SECRET === undefined) {
        missing = missing.concat(`\n JWT_SECRET`)
      }
      if (process.env.DB_USER === undefined) {
        missing = missing.concat(`\n DB_USER`)
      }
      if (process.env.DB_HOST === undefined) {
        missing = missing.concat(`\n DB_HOST`)
      }
      if (process.env.DB_DATABASE === undefined) {
        missing = missing.concat(`\n DB_DATABASE`)
      }
      if (process.env.DB_PASSWORD === undefined) {
        missing = missing.concat(`\n DB_PASSWORD`)
      }
      if (process.env.DB_PORT === undefined) {
        missing = missing.concat(`\n DB_PORT`)
      }
      if (missing === ``) {
        resolve()
      } else {
        const error = new Error(`Environment variable(s) missing:${missing}`)
        error.name = `EnvironmentVariableError`
        reject(error)
      }
    })
    return promise
  }

  /**
   * Recipe.Report application starter. Start listening for connections.
   *
   * @public
   * @memberof RecipeReport
   */
  public start = async (): Promise<void> => {
    try {
      await this.environmentVariablesExist()
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
  const recipeReport = new RecipeReport()
  recipeReport.start()
}
