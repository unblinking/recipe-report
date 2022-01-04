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
import { UniqueId } from 'domain/value/uid-value'

import { dbTables } from 'data/constants'
import { BaseRepo, IBaseRepo } from 'data/repositories/base-repo'

export interface IUserRepo extends IBaseRepo {
  create(user: User): Promise<User>
  read(id: UniqueId): Promise<User>
  activate(id: UniqueId): Promise<User>
  authenticate(user: User): Promise<User>
}

export class UserRepo extends BaseRepo<User> implements IUserRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.USERS)
  }

  public create = async (user: User): Promise<User> => {
    // Verify no existing user by name or email_address.
    if ((await this._countByColumn('name', user.name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    if ((await this._countByColumn('email_address', user.email_address.value)) > 0) {
      throw new Err(`EMAIL_USED`, errClient.EMAIL_USED)
    }
    // Save the user into the database.
    const query: string = `SELECT * FROM rr.users_create($1, $2, $3)`
    const result: QueryResult = await this.client.query(query, [
      user.name.value,
      user.password.value,
      user.email_address.value,
    ])
    // Return domain object from database query results.
    return UserMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public read = async (id: UniqueId): Promise<User> => {
    // Find the user by their unique id.
    const query: string = `SELECT * FROM rr.users_read($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`READ`, errUser.READ)
    }
    // Return domain object from database query results.
    return UserMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public activate = async (id: UniqueId): Promise<User> => {
    // TODO: Find the user and see if they're already activated?
    // Update a user's date_activated column.
    const query: string = `SELECT * FROM rr.users_activate($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`ACTIVATE`, errUser.ACTIVATE)
    }
    // Return domain object from database query results.
    return UserMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public authenticate = async (user: User): Promise<User> => {
    // Authenticate a user (find a match by email and password).
    const query: string = `SELECT * FROM rr.users_authenticate($1, $2)`
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

  private _countByColumn = async (column: string, value: string): Promise<number> => {
    const query: string = `SELECT * FROM rr.users_count_by_column_value($1, $2)`
    const result: QueryResult = await this.client.query(query, [column, value])
    const count: number = result.rows[0].users_count_by_column_value
    return count
  }

  private _updateLastLogin = async (id: string): Promise<void> => {
    const query: string = `SELECT * FROM rr.users_update_date_last_login($1)`
    const result: QueryResult = await this.client.query(query, [id])
    if (result.rows[0].users_update_date_last_login !== true) {
      throw new Err(`AUTHENTICATE`, errUser.AUTHENTICATE)
    }
  }
}
