/**
 * Recipe.Report.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import * as BodyParser from 'body-parser'

import App from './app'
import Logger from './services/logger'

import Root from './controllers/root'
import Test from './controllers/test'

const PackageJson = require('../package.json')

interface Starter {
  start(): void
}

// Recipe.Report.
class RecipeReport implements Starter {
  constructor() {}
  // The port number for the application to listen on.
  private port: number = 1138

  private diary: any = new Logger()

  // MiddleWares that will be used.
  private middleWares: any = [
    BodyParser.json(),
    BodyParser.urlencoded({ extended: true }),
    this.diary.writer,
  ]

  // Controllers that will be used.
  private controllers: any = [new Root(), new Test()]

  // Instantiate the Expressjs application.
  private app: any = new App(this.port, this.middleWares, this.controllers)

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
    \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${PackageJson.version}
    \x1b[0m`

  // "Let's Go" plays on the Stylophone
  public start(): void {
    this.app.listen()
    console.log(this.graffiti)
  }
}

// If the file is being run directly, start the Recipe.Report API now.
if (require.main === module) {
  const recipeReport = new RecipeReport()
  recipeReport.start()
}
