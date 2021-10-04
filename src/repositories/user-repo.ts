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
 */

/** Internal imports. */
import { BaseRepo } from './base-repo'
import { UserModel } from '../db/models/user-model'
import { PoolClient } from 'pg'

const USERS_TABLE: string = `users`

export class UserRepo extends BaseRepo<UserModel> {
  constructor(db: PoolClient) {
    super(db, USERS_TABLE)
  }

  public countByUsername = async (username: string): Promise<number> => {
    const query = `SELECT username FROM ${USERS_TABLE} WHERE username = $1`
    const result = await this.db.query(query, [username])
    const count = result.rowCount
    return count
  }

  public countByEmailAddress = async (
    email_address: string
  ): Promise<number> => {
    const query = `SELECT email_address FROM ${USERS_TABLE} WHERE email_address = $1`
    const result = await this.db.query(query, [email_address])
    const count = result.rowCount
    return count
  }
}
