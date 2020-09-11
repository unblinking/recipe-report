/**
 * Expressjs application.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import expressjs from 'express'

interface Listener {
  listen(): void
}

// Expressjs application.
class App implements Listener {
  constructor(port: number, middleWares: any, controllers: any) {
    this.app = expressjs()
    this.port = port
    this.middlewares(middleWares)
    this.controllers(controllers)
  }

  // The Expressjs application.
  private app: expressjs.Application

  // The port number for the application to listen on.
  private port: number

  // Use all of the provided middleWares.
  private middlewares(middleWares: any) {
    middleWares.forEach((middleWare: any) => {
      this.app.use(middleWare)
    })
  }

  // Use all of the provided controllers.
  private controllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router)
    })
  }

  // Listen on the provided port number.
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Application is listening on port ${this.port}`)
    })
  }
}

export default App
