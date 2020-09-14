/**
 * Expressjs application.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import Expressjs from 'express'
import { RequestHandler } from 'express'
import Controller from './interfaces/controller'
import Logger from './services/logger'

interface Listener {
  listen(): void
}

// Expressjs application.
class App implements Listener {
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
  public listen(): Promise<unknown> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        this.logger.write(`Expressjs is listening on port ${this.port}`)
        resolve()
      })
    })
  }
}

export default App
