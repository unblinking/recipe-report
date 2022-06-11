/**
 * Account repository.
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
import { AccountMap } from '@recipe-report/domain/maps'
import { Account, Err, errClient } from '@recipe-report/domain/models'
import type { DisplayName, UniqueId } from '@recipe-report/domain/values'
import type { PoolClient, QueryResult } from 'pg'

export interface IAccountRepo extends IBaseRepo {
  create(account: Account): Promise<Account>
  read(id: UniqueId): Promise<Account>
  readAllByUser(id: UniqueId): Promise<Account[]>
  update(
    id: UniqueId,
    name?: DisplayName,
    description?: string,
    contact_user_id?: UniqueId,
    location_code?: string,
    time_zone?: string,
    address_country?: string,
    address_locality?: string,
    address_region?: string,
    address_post_office_box?: string,
    address_postal_code?: string,
    address_street?: string,
  ): Promise<Account>
  delete(id: UniqueId): Promise<Account>
}

export class AccountRepo extends BaseRepo implements IAccountRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.ACCOUNTS)
  }

  public create = async (account: Account): Promise<Account> => {
    // Verify no existing account by name.
    if ((await this._countByColumn('name', account.name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Save the account into the database.
    const query: string = `SELECT * FROM rr.accounts_create($1, $2)`
    const result: QueryResult = await this.client.query(query, [
      account.name.value,
      account.contact_user_id.value,
    ])
    // Return domain object from database query results.
    return AccountMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public read = async (id: UniqueId): Promise<Account> => {
    // Find the account by their unique id.
    const query: string = `SELECT * FROM rr.accounts_read($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`ACCOUNT_READ`, errClient.ACCOUNT_READ)
    }
    // Return domain object from database query results.
    return AccountMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public readAllByUser = async (id: UniqueId): Promise<Account[]> => {
    const query: string = `SELECT * FROM rr.accounts_read_all_by_user($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    return result.rows.map((row) => AccountMap.dbToDomain(row, row.id))
  }

  public update = async (
    id: UniqueId,
    name?: DisplayName,
    description?: string,
    contact_user_id?: UniqueId,
    location_code?: string,
    time_zone?: string,
    address_country?: string,
    address_locality?: string,
    address_region?: string,
    address_post_office_box?: string,
    address_postal_code?: string,
    address_street?: string,
  ): Promise<Account> => {
    // Verify the incoming account name isn't being used by any account, except of
    // course if used by the account we are going to update now.
    if (name != undefined && (await this._countByColumnNotId(id.value, 'name', name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Update the account into the database.
    const query: string = `SELECT * FROM rr.accounts_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
    const result: QueryResult = await this.client.query(query, [
      id.value,
      name != undefined ? name.value : null,
      description != undefined ? description : null,
      contact_user_id != undefined ? contact_user_id.value : null,
      location_code != undefined ? location_code : null,
      time_zone != undefined ? time_zone : null,
      address_country != undefined ? address_country : null,
      address_locality != undefined ? address_locality : null,
      address_region != undefined ? address_region : null,
      address_post_office_box != undefined ? address_post_office_box : null,
      address_postal_code != undefined ? address_postal_code : null,
      address_street != undefined ? address_street : null,
    ])
    if (result.rowCount !== 1) {
      throw new Err(`ACCOUNT_UPDATE`, errClient.ACCOUNT_UPDATE)
    }
    // Return domain object from database query results.
    return AccountMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public delete = async (id: UniqueId): Promise<Account> => {
    // Delete the account by their unique id.
    const query: string = `SELECT * FROM rr.accounts_delete($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`ACCOUNT_DELETE`, errClient.ACCOUNT_DELETE)
    }
    // Return domain object from database query results.
    return AccountMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  // Function to return the count of account records that match a given column/value
  private _countByColumn = async (column: string, value: string): Promise<number> => {
    const query: string = `SELECT * FROM rr.accounts_count_by_column_value($1, $2)`
    const result: QueryResult = await this.client.query(query, [column, value])
    const count: number = result.rows[0].accounts_count_by_column_value
    return count
  }

  // Function to return the count of records, other than the specified record id, that match a given column/value
  private _countByColumnNotId = async (
    id: string,
    column: string,
    value: string,
  ): Promise<number> => {
    const query: string = `SELECT * FROM rr.accounts_count_by_column_value_not_id($1, $2, $3)`
    const result: QueryResult = await this.client.query(query, [id, column, value])
    const count: number = result.rows[0].accounts_count_by_id_column_value
    return count
  }
}
