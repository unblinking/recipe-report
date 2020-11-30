/**
 * PostgreSQL database access.
 * @see {@link https://www.postgresql.org/ PostgreSQL}
 */

/** External imports. */
import { Pool, PoolClient, QueryResult } from 'pg'

/** Internal imports. */
import Logger from '../services/logger'

/**
 * `node-postgres` wrapper.
 * @see {@link https://node-postgres.com/ node-postgres}
 * @see {@link https://node-postgres.com/guides/project-structure Suggested Project Structure Using async/await}
 */
class PostgreSQL {
  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof RecipeReport
   */
  private logger: Logger = new Logger()

  /**
   * `node-postgres` connection pool.
   *
   * @private
   * @type {Pool}
   * @memberof PostgreSQL
   */
  private pool: Pool = new Pool({
    user: process.env.DB_USER ?? ``,
    host: process.env.DB_HOST ?? ``,
    database: process.env.DB_DATABASE ?? ``,
    password: process.env.DB_PASSWORD ?? ``,
    port: parseInt(process.env.DB_PORT ?? ``, 10),
  })

  public query = async (
    text: string,
    params: Array<string>
  ): Promise<QueryResult> => {
    try {
      // Remember when we started.
      const start = Date.now()
      // Run the query.
      const res = await this.pool.query(text, params)
      // Now that the query is done, how much time passed?
      const duration = Date.now() - start
      // Log some query execution information.
      this.logger.write(`Executed query. ${text}, ${duration}, ${res.rowCount}`)
      return res
    } catch (error) {
      this.logger.write(error)
      return error
    }
  }

  public getClient = async (): Promise<PoolClient> => {
    try {
      const client = await this.pool.connect()
      // Make a backup copy of normal the client.release method.
      const release = client.release
      // Set a timeout of 5 seconds, after which we will log an error.
      const timeout = setTimeout(() => {
        console.error('A pg client has been out for more than 5 seconds!')
      }, 5000)
      // Override client.release to clear our timeout.
      client.release = () => {
        // Clear our timeout.
        clearTimeout(timeout)
        // Set client.release back to the normal method.
        client.release = release
        return release.apply(client)
      }
      return client
    } catch (error) {
      this.logger.write(error)
      return error
    }
  }
}

export default PostgreSQL
