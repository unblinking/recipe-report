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
import { PoolClient } from 'pg'

import { errMsg } from 'data/constants'
import { IDataAccessLayer } from 'data/data-access'
import { IUserRepo, UserRepo } from 'data/repositories/user-repo'

import { SYMBOLS } from 'root/symbols'
import { Err } from 'root/utils'

export interface IUnitOfWork {
  connect(): Promise<void>
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  users: IUserRepo
}

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private _dal: IDataAccessLayer
  private _userRepo: IUserRepo | undefined
  private _client: PoolClient | undefined

  public constructor(
    @inject(SYMBOLS.IDataAccessLayer) dataAccessLayer: IDataAccessLayer,
  ) {
    this._dal = dataAccessLayer
  }

  public connect = async (): Promise<void> => {
    this._client = await this._dal.getClient()
  }

  public begin = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errMsg.UOW_CLIENT)
    await this._client.query('BEGIN')
  }

  public commit = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errMsg.UOW_CLIENT)
    await this._client.query('COMMIT')
    this._client.release()
  }

  public rollback = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errMsg.UOW_CLIENT)
    await this._client.query('ROLLBACK')
    this._client.release()
  }

  public get users(): IUserRepo {
    if (!this._client) throw new Err('UOW_CLIENT', errMsg.UOW_CLIENT)
    if (!this._userRepo) {
      this._userRepo = new UserRepo(this._client)
    }
    return this._userRepo
  }
}
