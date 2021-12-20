/**
 * Unit of work.
 * Coordinate the work of multiple repositories.
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
import { inject, injectable } from 'inversify'
import { TYPES } from 'types'

import { IDataAccessLayer } from '../data-access'
import { IUserRepo } from './user-repo'

export interface IUnitOfWork {
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
}

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private _dataAccessLayer: IDataAccessLayer
  private _userRepo: IUserRepo

  public constructor(
    @inject(TYPES.IDataAccessLayer) dataAccessLayer: IDataAccessLayer,
    @inject(TYPES.IUserRepo) userRepo: IUserRepo,
  ) {
    this._dataAccessLayer = dataAccessLayer
    this._userRepo = userRepo
  }

  public begin = async (): Promise<void> => {
    // Begin a transaction.
  }

  public commit = async (): Promise<void> => {
    // Commit a transaction.
  }

  public rollback = async (): Promise<void> => {
    // Rollback a transaction.
  }

  public users
}
