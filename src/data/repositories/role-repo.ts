/**
 * Role repository.
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

import { RoleMap } from 'domain/maps/role-map'
import { Err, errClient } from 'domain/models/err-model'
import { Role } from 'domain/models/role-model'

import { dbTables } from 'data/constants'
import { BaseRepo, IBaseRepo } from 'data/repositories/base-repo'

export interface IRoleRepo extends IBaseRepo {
  create(role: Role): Promise<Role>
}

export class RoleRepo extends BaseRepo<Role> implements IRoleRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.ROLES)
  }

  public create = async (role: Role): Promise<Role> => {
    // Verify no existing role by name.
    if ((await this._countByColumn('name', role.name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Save the role into the database.
    const query: string = `SELECT * FROM rr.roles_create($1, $2)`
    const result: QueryResult = await this.client.query(query, [role.name.value, role.description])
    // Return domain object from database query results.
    return RoleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  // Function to return the count of role records that match a given column/value
  private _countByColumn = async (column: string, value: string): Promise<number> => {
    const query: string = `SELECT * FROM rr.roles_count_by_column_value($1, $2)`
    const result: QueryResult = await this.client.query(query, [column, value])
    const count: number = result.rows[0].roles_count_by_column_value
    return count
  }
}
