import { Router } from 'express'

interface Controller {
  initRoutes(): void
  router: Router
}

export default Controller
