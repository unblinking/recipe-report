/**
 * DAL (Data access layer).
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
import { injectable } from 'inversify'
import { Pool, PoolClient, QueryResult } from 'pg'
import 'reflect-metadata'

import { log } from 'root/utils'

export interface IDataAccessLayer {
  query(text: string, params: Array<string>): Promise<QueryResult>
  getClient(): Promise<PoolClient>
}

/**
 * A `node-postgres` wrapper.
 * @see {@link https://node-postgres.com/ node-postgres}
 * @see {@link https://node-postgres.com/guides/project-structure Suggested Project Structure Using async/await}
 */
@injectable()
export class DataAccessLayer implements IDataAccessLayer {
  private _pool: Pool = new Pool({
    user: process.env.RRDB_USER as string,
    host: process.env.RRDB_HOST as string,
    database: process.env.RRDB_DATABASE as string,
    password: process.env.RRDB_PASSWORD as string,
    port: parseInt(process.env.RRDB_PORT as string, 10),
    ssl:
      process.env.NODE_ENV == 'production'
        ? {
            rejectUnauthorized: false,
            ca: process.env.RRDB_CA_CERT,
          }
        : false,
  })

  /**
   * Run a single query using pool.query and get the query results back.
   *
   * @memberof DataAccessLayer
   * @returns The QueryResult object.
   */
  public query = async (
    text: string,
    params: Array<string>,
  ): Promise<QueryResult> => {
    const start: number = Date.now()
    const result: QueryResult<never> = await this._pool.query(text, params)
    const duration: number = Date.now() - start
    log.info(`Executed query. ${text}, ${duration}, ${result.rowCount}`)
    return result
  }

  /**
   * Check out a client using pool.connect. Will log a warning when the client
   * remains checked out for longer than five seconds without releasing.
   *
   * @memberof DataAccessLayer
   * @returns The PoolClient object.
   */
  public getClient = async (): Promise<PoolClient> => {
    const client: PoolClient = await this._pool.connect()
    const release = client.release // Make a backup client.release.
    const timeout: NodeJS.Timeout = setTimeout(() => {
      log.warn(`A pg client has been out for more than 10 seconds!`)
    }, 10000)
    client.release = (): void => {
      // Override client.release.
      clearTimeout(timeout)
      client.release = release // Reset client.release.
      return release.apply(client)
    }
    return client
  }
}
