/**
 * Inversion-of-control configuration.
 * Dependency injection container.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/api.recipe.report}
 *
 * Recipe.Report API Server is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report API Server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import { Container } from 'inversify'
import 'reflect-metadata'

import { IBaseController } from './api/controllers/base-controller'
import { RootController } from './api/controllers/root-controller'
import { UserController } from './api/controllers/user-controller'

import { DataAccessLayer, IDataAccessLayer } from './data/data-access'
import { EmailFactory, IEmailFactory } from './data/factories/email-factory'
import { IUnitOfWork, UnitOfWork } from './data/repositories/unit-of-work'

import { EmailService, IEmailService } from './service/email-service'
import { IUserService, UserService } from './service/user-service'

import { IRecipeReport, RecipeReport } from './recipereport'
import { TYPES } from './types'

const container = new Container()

// Add the RecipeReport class to the container.
container.bind<IRecipeReport>(TYPES.IRecipeReport).to(RecipeReport)

// Add the controllers to the container.
container.bind<IBaseController>(TYPES.IBaseController).to(RootController)
container.bind<IBaseController>(TYPES.IBaseController).to(UserController)

// Add data handlers to the container.
container.bind<IDataAccessLayer>(TYPES.IDataAccessLayer).to(DataAccessLayer)
container.bind<IEmailFactory>(TYPES.IEmailFactory).to(EmailFactory)
container.bind<IUnitOfWork>(TYPES.IUnitOfWork).to(UnitOfWork).inTransientScope()

// Add services to the container.
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService)
container.bind<IUserService>(TYPES.IUserService).to(UserService)

export { container }
