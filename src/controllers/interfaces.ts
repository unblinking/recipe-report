/**
 * Controller interfaces.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Router } from 'express'

export interface IController {
  router: Router
  path: string
  initRoutes(): void
}
