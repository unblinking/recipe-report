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

import { Err, errInternal } from 'domain/models/err-model'

import { IDataAccessLayer } from 'data/data-access'
import { FeatureRepo, IFeatureRepo } from 'data/repositories/feature-repo'
import { IRoleRepo, RoleRepo } from 'data/repositories/role-repo'
import { IUserRepo, UserRepo } from 'data/repositories/user-repo'

import { SYMBOLS } from 'root/symbols'

export interface IUnitOfWork {
  connect(): Promise<void>
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  features: IFeatureRepo
  roles: IRoleRepo
  users: IUserRepo
}

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private _dal: IDataAccessLayer
  private _client: PoolClient | undefined
  private _featureRepo: IFeatureRepo | undefined
  private _roleRepo: IRoleRepo | undefined
  private _userRepo: IUserRepo | undefined

  public constructor(@inject(SYMBOLS.IDataAccessLayer) dataAccessLayer: IDataAccessLayer) {
    this._dal = dataAccessLayer
  }

  public connect = async (): Promise<void> => {
    this._client = await this._dal.getClient()
  }

  public begin = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    await this._client.query('BEGIN')
  }

  public commit = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    await this._client.query('COMMIT')
    this._client.release()
  }

  public rollback = async (): Promise<void> => {
    // If there is no client, there is nothing to rollback or release.
    if (!this._client) {
      return
    }
    await this._client.query('ROLLBACK')
    this._client.release()
  }

  public get features(): IFeatureRepo {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    if (!this._featureRepo) {
      this._featureRepo = new FeatureRepo(this._client)
    }
    return this._featureRepo
  }

  public get roles(): IRoleRepo {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    if (!this._roleRepo) {
      this._roleRepo = new RoleRepo(this._client)
    }
    return this._roleRepo
  }

  public get users(): IUserRepo {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    if (!this._userRepo) {
      this._userRepo = new UserRepo(this._client)
    }
    return this._userRepo
  }
}
