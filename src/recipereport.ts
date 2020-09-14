/**
 * Recipe.Report.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { RequestHandler } from 'express'
import * as BodyParser from 'body-parser'
import Helmet from 'helmet'

import App from './app'

import CallHistory from './middlewares/callhistory'
import Controller from './interfaces/controller'
import Root from './controllers/root'
import Test from './controllers/test'

import Logger from './services/logger'

interface Starter {
  start(): void
}

interface Listener {
  listen(): void
}

// Recipe.Report.
class RecipeReport implements Starter {
  // The port number for the application to listen on.
  private port: number = parseInt(process.env.PORT ?? '', 10)

  // The current relase version of the Recipe.Report API.
  private version: string = process.env.npm_package_version ?? ''

  // Fun graffiti for the console.
  private graffiti: string = `\x1b[1m\x1b[32m
     ____           _
    |  _ \\ ___  ___(_)_ __   ___
    | |_) / _ \\/ __| | '_ \\ / _ \\
    |  _ <  __/ (__| | |_) |  __/
    |_|_\\_\\___|\\___|_| .__/ \\___|
    |  _ \\ ___ _ __  |_|_  _ __| |_
    | |_) / _ \\ '_ \\ / _ \\| '__| __|
    |  _ <  __/ |_) | (_) | |  | |_
    |_| \\_\\___| .__/ \\___/|_|   \\__|
    \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${this.version}
    \x1b[0m`

  // The API call historian middelware.
  private callHistory: CallHistory = new CallHistory()

  // The general logging service.
  private logger: Logger = new Logger()

  // MiddleWares that will be used.
  private middlewares: Array<RequestHandler> = [
    Helmet(), // Incease security of the Express app, set various HTTP headers.
    BodyParser.json(), // Parses JSON.
    BodyParser.urlencoded({ extended: true }), // Parses urlencoded bodies.
    this.callHistory.log.bind(this.callHistory), // Log all API calls.
  ]

  // Controllers that will be used.
  private controllers: Array<Controller> = [new Root(), new Test()]

  // Instantiate the Expressjs application.
  private app: Listener = new App(this.port, this.middlewares, this.controllers)

  // "Let's Go" plays on the Stylophone
  public async start(): Promise<void> {
    try {
      await this.app.listen()
      this.logger.write(this.graffiti)
    } catch (ex) {
      this.logger.write(ex)
      process.exit(1)
    }
  }
}

// If the file is being run directly, start the Recipe.Report API now.
if (require.main === module) {
  const recipeReport = new RecipeReport()
  recipeReport.start()
}

export default RecipeReport
