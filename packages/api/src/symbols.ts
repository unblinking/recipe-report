/**
 * Inversion-of-control symbols.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */

export const SYMBOLS = {
  IRecipeReport: Symbol.for('IRecipeReport'),

  IBaseController: Symbol.for('IBaseConroller'),

  IDataAccessLayer: Symbol.for('IDataAccessLayer'),
  IUnitOfWork: Symbol.for('IUnitOfWork'),

  IAccountService: Symbol.for('IAccountService'),
  ICryptoService: Symbol.for('ICryptoService'),
  IEmailService: Symbol.for('IEmailService'),
  IFeatureService: Symbol.for('IFeatureService'),
  IJwtService: Symbol.for('IJwtService'),
  IRecipeService: Symbol.for('IRecipeService'),
  IRoleService: Symbol.for('IRoleService'),
  IUserService: Symbol.for('IUserService'),
}
