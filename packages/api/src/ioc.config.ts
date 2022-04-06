/**
 * Inversion-of-control configuration.
 * Dependency injection container.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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
import {
  AccountController,
  FeatureController,
  RoleController,
  RootController,
  UserController,
} from '@recipe-report/api/controllers'
import type { IBaseController } from '@recipe-report/api/controllers'
import { SYMBOLS } from '@recipe-report/api/ioc'
import type { IDataAccessLayer } from '@recipe-report/data'
import { DataAccessLayer } from '@recipe-report/data'
import type { IUnitOfWork } from '@recipe-report/data/repositories'
import { UnitOfWork } from '@recipe-report/data/repositories'
import type {
  IAccountService,
  ICryptoService,
  IEmailService,
  IFeatureService,
  IJwtService,
  IRoleService,
  IUserService,
} from '@recipe-report/service'
import {
  AccountService,
  CryptoService,
  EmailService,
  FeatureService,
  JwtService,
  RoleService,
  UserService,
} from '@recipe-report/service'
import { Container } from 'inversify'

import type { IRecipeReport } from './recipereport'
import { RecipeReport } from './recipereport'

const container = new Container()

// Add the RecipeReport class to the container.
container.bind<IRecipeReport>(SYMBOLS.IRecipeReport).to(RecipeReport)

// Add the controllers to the container.
container.bind<IBaseController>(SYMBOLS.IBaseController).to(AccountController)
container.bind<IBaseController>(SYMBOLS.IBaseController).to(FeatureController)
container.bind<IBaseController>(SYMBOLS.IBaseController).to(RoleController)
container.bind<IBaseController>(SYMBOLS.IBaseController).to(RootController)
container.bind<IBaseController>(SYMBOLS.IBaseController).to(UserController)

// Add data handlers to the container.
container.bind<IDataAccessLayer>(SYMBOLS.IDataAccessLayer).to(DataAccessLayer)
container.bind<IUnitOfWork>(SYMBOLS.IUnitOfWork).to(UnitOfWork)

// Add services to the container.
container.bind<IAccountService>(SYMBOLS.IAccountService).to(AccountService)
container.bind<ICryptoService>(SYMBOLS.ICryptoService).to(CryptoService)
container.bind<IEmailService>(SYMBOLS.IEmailService).to(EmailService)
container.bind<IFeatureService>(SYMBOLS.IFeatureService).to(FeatureService)
container.bind<IJwtService>(SYMBOLS.IJwtService).to(JwtService)
container.bind<IRoleService>(SYMBOLS.IRoleService).to(RoleService)
container.bind<IUserService>(SYMBOLS.IUserService).to(UserService)

export { container }
