/**
 * Expressjs application.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import Expressjs from 'express'
import { RequestHandler } from 'express'
import Controller from './interfaces/controller'
import Logger from './services/logger'

interface ExpressWrapper {
  listenWrapper(): Promise<unknown>
}

// Expressjs application.
class App implements ExpressWrapper {
  constructor(
    port: number,
    middlewares: Array<RequestHandler>,
    controllers: Array<Controller>
  ) {
    this.port = port
    this.middlewares(middlewares)
    this.controllers(controllers)
  }

  // The Expressjs application.
  private app: Expressjs.Application = Expressjs()

  // The logger service.
  private logger: Logger = new Logger()

  // The port number for the application to listen on.
  private port: number

  // Use all of the provided middleWares.
  private middlewares(middlewares: Array<RequestHandler>) {
    this.app.use(middlewares)
  }

  // Use all of the provided controllers.
  private controllers(controllers: Array<Controller>) {
    controllers.forEach((controller: Controller) => {
      this.app.use('/', controller.router)
    })
  }

  // Listen on the provided port number.
  public listenWrapper(): Promise<unknown> {
    const promise = new Promise((resolve) => {
      this.app.listen(this.port, () => {
        this.logger.write(`Expressjs is listening on port ${this.port}`)
        resolve()
      })
    })
    return promise
  }
}

export default App
