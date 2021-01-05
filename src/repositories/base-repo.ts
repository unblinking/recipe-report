/**
 * Base class for all repositories to extend from.
 * Defines basic CRUD operations with PostgreSQL.
 */

// https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e

import { PoolClient, QueryResult } from 'pg'
import { IRead, IWrite } from './interfaces'

export abstract class BaseRepo<T> implements IRead, IWrite<T> {
  public db: PoolClient
  private table: string

  constructor(db: PoolClient, table: string) {
    this.db = db
    this.table = table
  }

  public createOne = async (item: T): Promise<QueryResult> => {
    const query = `INSERT INTO ${this.table} (${this.cols(
      item
    )}) VALUES (${this.pars(item)}) RETURNING *`
    const result = await this.db.query(query, this.vals(item))
    return result
  }

  public findOneById = async (id: string): Promise<QueryResult> => {
    const query = `SELECT * FROM ${this.table} WHERE id = $1`
    const result = await this.db.query(query, [id])
    return result
  }

  public updateOneById = async (item: T): Promise<QueryResult> => {
    const query = `UPDATE ${this.table} SET (${this.cols(item)}) = (${this.pars(
      item
    )}) WHERE id = $1 RETURNING *`
    const result = await this.db.query(query, this.vals(item))
    return result
  }

  public deleteOneById = async (id: string): Promise<boolean> => {
    console.log(id)
    throw new Error('Method not implemented.')
  }

  /**
   * Get query columns.
   * Gets a list of column names, for columns that contain defined values only.
   *
   * @private
   * @memberof BaseRepo
   * @returns A comma separated list of column names.
   */
  private cols = (item: T): string => {
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
  private vals = (item: T): string[] => {
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
  private pars = (item: T): string => {
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
