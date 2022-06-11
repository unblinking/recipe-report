/**
 * Role repository.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/unblinking/recipe-report}
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
import { dbTables } from '@recipe-report/data'
import type { IBaseRepo } from '@recipe-report/data/repositories'
import { BaseRepo } from '@recipe-report/data/repositories'
import { RoleMap } from '@recipe-report/domain/maps'
import { Err, errClient, Role } from '@recipe-report/domain/models'
import type { DisplayName, SmallInt, UniqueId } from '@recipe-report/domain/values'
import type { PoolClient, QueryResult } from 'pg'

export interface IRoleRepo extends IBaseRepo {
  create(role: Role): Promise<Role>
  read(id: UniqueId): Promise<Role>
  update(id: UniqueId, name?: DisplayName, description?: string, level?: SmallInt): Promise<Role>
  delete(id: UniqueId): Promise<Role>
}

export class RoleRepo extends BaseRepo implements IRoleRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.ROLES)
  }

  public create = async (role: Role): Promise<Role> => {
    // Verify no existing role by name.
    if ((await this._countByColumn('name', role.name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Save the role into the database.
    const query: string = `SELECT * FROM rr.roles_create($1, $2, $3)`
    const result: QueryResult = await this.client.query(query, [
      role.name.value,
      role.description,
      role.level.value,
    ])
    // Return domain object from database query results.
    return RoleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public read = async (id: UniqueId): Promise<Role> => {
    // Find the role by their unique id.
    const query: string = `SELECT * FROM rr.roles_read($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`ROLE_READ`, errClient.ROLE_READ)
    }
    // Return domain object from database query results.
    return RoleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public update = async (
    id: UniqueId,
    name?: DisplayName,
    description?: string,
    level?: SmallInt,
  ): Promise<Role> => {
    // Verify the incoming role name isn't being used by any role, except of
    // course if used by the role we are going to update now.
    if (name != undefined && (await this._countByColumnNotId(id.value, 'name', name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Update the role into the database.
    const query: string = `SELECT * FROM rr.roles_update($1, $2, $3, $4)`
    const result: QueryResult = await this.client.query(query, [
      id.value,
      name != undefined ? name.value : null,
      description != undefined ? description : null,
      level != undefined ? level.value : null,
    ])
    if (result.rowCount !== 1) {
      throw new Err(`ROLE_UPDATE`, errClient.ROLE_UPDATE)
    }
    // Return domain object from database query results.
    return RoleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public delete = async (id: UniqueId): Promise<Role> => {
    // Delete the role by their unique id.
    const query: string = `SELECT * FROM rr.roles_delete($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`ROLE_DELETE`, errClient.ROLE_DELETE)
    }
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

  // Function to return the count of records, other than the specified record id, that match a given column/value
  private _countByColumnNotId = async (
    id: string,
    column: string,
    value: string,
  ): Promise<number> => {
    const query: string = `SELECT * FROM rr.roles_count_by_column_value_not_id($1, $2, $3)`
    const result: QueryResult = await this.client.query(query, [id, column, value])
    const count: number = result.rows[0].roles_count_by_id_column_value
    return count
  }
}
