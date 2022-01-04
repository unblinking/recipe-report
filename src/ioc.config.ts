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

import { DataAccessLayer, IDataAccessLayer } from 'data/data-access'
import { IUnitOfWork, UnitOfWork } from 'data/repositories/unit-of-work'

import { CryptoService, ICryptoService } from 'service/crypto-service'
import { EmailService, IEmailService } from 'service/email-service'
import { IJwtService, JwtService } from 'service/jwt-service'
import { IUserService, UserService } from 'service/user-service'

import { IBaseController } from 'api/controllers/base-controller'
import { RootController } from 'api/controllers/root-controller'
import { UserController } from 'api/controllers/user-controller'

import { IRecipeReport, RecipeReport } from 'root/recipereport'
import { SYMBOLS } from 'root/symbols'

export const container = new Container()

// Add the RecipeReport class to the container.
container.bind<IRecipeReport>(SYMBOLS.IRecipeReport).to(RecipeReport)

// Add the controllers to the container.
container.bind<IBaseController>(SYMBOLS.IBaseController).to(RootController)
container.bind<IBaseController>(SYMBOLS.IBaseController).to(UserController)

// Add data handlers to the container.
container.bind<IDataAccessLayer>(SYMBOLS.IDataAccessLayer).to(DataAccessLayer)
container.bind<IUnitOfWork>(SYMBOLS.IUnitOfWork).to(UnitOfWork)

// Add services to the container.
container.bind<ICryptoService>(SYMBOLS.ICryptoService).to(CryptoService)
container.bind<IEmailService>(SYMBOLS.IEmailService).to(EmailService)
container.bind<IJwtService>(SYMBOLS.IJwtService).to(JwtService)
container.bind<IUserService>(SYMBOLS.IUserService).to(UserService)
