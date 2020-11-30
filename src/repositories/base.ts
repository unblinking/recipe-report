// https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e

import { PoolClient, QueryResult } from 'pg'

interface IRead {
  findOneById(id: string): Promise<QueryResult>
}

interface IWrite<T> {
  createOne(item: T): Promise<QueryResult>
  // update(id: string, item: T): Promise<boolean>
  // delete(id: string): Promise<boolean>
}

abstract class BaseRepo<T> implements IRead, IWrite<T> {
  private _db: PoolClient
  private _table: string

  constructor(db: PoolClient, table: string) {
    this._db = db
    this._table = table
  }

  public createOne = async (item: T): Promise<QueryResult> => {
    // Create arrays of columns and values based on the model.
    const columnsArray: string[] = []
    const values: string[] = []
    Object.keys(item).forEach((column) => {
      const value: string = item[column]
      if (value !== null && value !== undefined) {
        columnsArray.push(column)
        values.push(value)
      }
    })
    // The query requires column names as comma separated values.
    const columns: string = columnsArray.join(',')
    // Create parameters for substitution (parameterized queries).
    const paramsArray: string[] = []
    for (let i = 1; i <= columnsArray.length; i++) {
      paramsArray.push(`$` + i)
    }
    // The query requires parameters as comma separated values.
    const parameters = paramsArray.join(',')
    // Create the query text.
    const query = `INSERT INTO ${this._table} (${columns}) VALUES (${parameters}) RETURNING *`
    // Execute the query.
    const result = await this._db.query(query, values)
    this._db.release()
    return result
  }

  public findOneById = async (id: string): Promise<QueryResult> => {
    const result = await this._db.query(
      `SELECT * FROM ${this._table} WHERE id = $1`,
      [id]
    )
    return result
  }

  /*
  public update = async (id: string, item: T): Promise<boolean> => {
    throw new Error('Method not implemented.')
  }

  public delete = async (id: string): Promise<boolean> => {
    throw new Error('Method not implemented.')
  }
  */
}

export default BaseRepo
