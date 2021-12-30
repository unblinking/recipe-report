/**
 * User repository.
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
import { PoolClient, QueryResult } from 'pg'

import { UserMap } from 'domain/maps/user-map'
import { Err, errClient, errUser } from 'domain/models/err-model'
import { User } from 'domain/models/user-model'

import { dbTables } from 'data/constants'
import { BaseRepo, IBaseRepo } from 'data/repositories/base-repo'

export interface IUserRepo extends IBaseRepo {
  create(user: User): Promise<User>
  authenticate(user: User): Promise<User>
}

export class UserRepo extends BaseRepo<User> implements IUserRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.USERS)
  }

  public create = async (user: User): Promise<User> => {
    // Verify no existing user by username or email address.
    const countName = await this._countByColumn('name', user.name.value)
    if (countName > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }

    const countEmail = await this._countByColumn(
      'email_address',
      user.email_address.value,
    )
    if (countEmail > 0) {
      throw new Err(`EMAIL_USED`, errClient.EMAIL_USED)
    }

    // Save the user into the database.
    const query = `SELECT * FROM rr.users_create($1, $2, $3)`
    const result: QueryResult = await this.client.query(query, [
      user.name.value,
      user.password.value,
      user.email_address.value,
    ])

    // Return domain object from database query results.
    return UserMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public authenticate = async (user: User): Promise<User> => {
    const query = `SELECT * FROM rr.users_authenticate($1, $2)`
    // Use this.pool.query, so that this query isn't logged like other queries.
    const result: QueryResult = await this.client.query(query, [
      user.email_address.value,
      user.password.value,
    ])
    if (result.rowCount !== 1) {
      throw new Err(`AUTHENTICATE`, errUser.AUTHENTICATE)
    }

    // Update the authenticated user's last login date in the database.
    await this._updateLastLogin(result.rows[0].id)

    // Return domain object from database query results.
    return UserMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  //#region Private methods

  private _countByColumn = async (
    column: string,
    value: string,
  ): Promise<number> => {
    const query = `SELECT * FROM rr.users_count_by_column_value($1, $2)`
    const result = await this.client.query(query, [column, value])
    const count = result.rows[0].count
    return count
  }

  private _updateLastLogin = async (id: string): Promise<void> => {
    const query: string = `SELECT * FROM rr.users_update_date_last_login($1)`
    const result = await this.client.query(query, [id])
    if (result.rows[0].users_update_date_last_login !== true) {
      throw new Err(`AUTHENTICATE`, errUser.AUTHENTICATE)
    }
  }

  //#endregion
}
