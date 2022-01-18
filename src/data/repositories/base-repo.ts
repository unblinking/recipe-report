/**
 * Base class for all repositories to extend from.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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

import { dbTablesValueType } from 'data/constants'

/**
 * This is the abstract class used as the base repository class for all of the
 * other repository classes.
 *
 * This has been written so that we have the basic CRUD operations ready to go.
 *
 * These are written as parameterized queries to avoid SQL injection
 * vulnerabilities. The node-postgres library supports parameterized queries
 * and will pass the query text unaltered as well as the parameters to the
 * PostgreSQL server, where the parameters are safely substituted into the query
 * with battle-tested parameter substitution code on the server itself.
 *
 * I have included some private helper methods below the public CRUD methods.
 * The private helpers are:
 * - cols: Get a list of column names for defined values in the item.
 * - vals: Get a list of column values for defined values in the item.
 * - pars: Get a list of parameters (i.e. "$1, $2") based on the number of
 *         defined values in the item.
 * Using these helpers we can quickly run a parameterized query for any item
 * passed to the CRUD methods from any of the repositories. For more specialized
 * operations, the methods will be inside the individual repository classes.
 *
 * See the node-postgres page about queries:
 * @see {@link https://node-postgres.com/features/queries}
 *
 * Some ideas were based on the concepts discussed in this article:
 * @see {@link https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e}
 */
export interface IBaseRepo {
  client: PoolClient
  /*
  createOne(item: T): Promise<QueryResult>
  readOne(id: string): Promise<QueryResult>
  updateOne(item: T): Promise<QueryResult>
  deleteOne(id: string): Promise<QueryResult>
  */
}

export abstract class BaseRepo<T> implements IBaseRepo {
  public client: PoolClient
  protected _table: dbTablesValueType

  constructor(client: PoolClient, table: dbTablesValueType) {
    this.client = client
    this._table = table
  }

  protected _createOne = async (item: T): Promise<QueryResult> => {
    const query = `INSERT INTO ${this._table} (${this._cols(item)}) VALUES (${this._pars(
      item,
    )}) RETURNING *`
    const result = await this.client.query(query, this._vals(item))
    return result
  }

  protected _readOne = async (id: string): Promise<QueryResult> => {
    const query = `SELECT * FROM ${this._table} WHERE id = $1`
    const result = await this.client.query(query, [id])
    return result
  }

  protected _updateOne = async (item: T): Promise<QueryResult> => {
    const query = `UPDATE ${this._table} SET (${this._cols(item)}) = (${this._pars(
      item,
    )}) WHERE id = $1 RETURNING *`
    const result = await this.client.query(query, this._vals(item))
    return result
  }

  protected _deleteOne = async (id: string): Promise<QueryResult> => {
    const query = `DELETE FROM ${this._table} WHERE id = $1`
    const result = await this.client.query(query, [id])
    return result
  }

  /**
   * Get query columns.
   * Gets a list of column names, for columns that contain defined values only.
   *
   * @private
   * @memberof BaseRepo
   * @returns A comma separated list of column names.
   */
  private _cols = (item: T): string => {
    const columnsArray: string[] = []
    Object.keys(item).forEach((column) => {
      const value: string = item[column]
      if (value !== null && value !== undefined) {
        columnsArray.push(column)
      }
    })
    const columns: string = columnsArray.join(',')
    return columns
  }

  /**
   * Get query values.
   * Gets a list of column values, for columns that contain defined values only.
   *
   * @private
   * @memberof BaseRepo
   * @returns An array of values as strings.
   */
  private _vals = (item: T): string[] => {
    const values: string[] = []
    Object.keys(item).forEach((column) => {
      const value: string = item[column]
      if (value !== null && value !== undefined) {
        values.push(value)
      }
    })
    return values
  }

  /**
   * Get query parameters, for use in our parameterized queries.
   * Gets a list of parameters (i.e. "$1, $2"), based on the number of defined
   * values in the item.
   *
   * @private
   * @memberof BaseRepo
   * @returns A comma separated list of parameter placeholders.
   */
  private _pars = (item: T): string => {
    const columnsArray: string[] = []
    Object.keys(item).forEach((column) => {
      const value: string = item[column]
      if (value !== null && value !== undefined) {
        columnsArray.push(column)
      }
    })
    const paramsArray: string[] = []
    for (let i = 1; i <= columnsArray.length; i++) {
      paramsArray.push(`$` + i)
    }
    const parameters: string = paramsArray.join(',')
    return parameters
  }
}
