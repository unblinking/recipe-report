/**
 * PostgreSQL database access.
 * @see {@link https://www.postgresql.org/ PostgreSQL}
 */

/** External imports. */
import { Pool, PoolClient, QueryResult } from 'pg'

/** Internal imports. */
import Logger from '../services/log'

/**
 * `node-postgres` wrapper.
 * @see {@link https://node-postgres.com/ node-postgres}
 * @see {@link https://node-postgres.com/guides/project-structure Suggested Project Structure Using async/await}
 */
export class PostgreSQL {
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
    const start = Date.now() // Remember when we started.
    const result = await this.pool.query(text, params) // Run the query.
    const duration = Date.now() - start // Now that the query is done, how much time passed?
    this.logger.write(
      // Log some query execution information.
      `Executed query. ${text}, ${duration}, ${result.rowCount}`
    )
    return result
  }

  public getClient = async (): Promise<PoolClient> => {
    const client = await this.pool.connect()
    const release = client.release // Make a backup copy of normal the client.release method.
    const timeout = setTimeout(() => {
      // Set a timeout of 5 seconds, after which we will log an error.
      console.error('A pg client has been out for more than 5 seconds!')
    }, 5000)
    client.release = (): void => {
      // Override client.release to clear our timeout.
      clearTimeout(timeout) // Clear our timeout.
      client.release = release // Set client.release back to the normal method.
      return release.apply(client)
    }
    return client
  }

  public hashAndSalt = async (text: string): Promise<QueryResult> => {
    const query = `SELECT crypt('${text}', gen_salt('bf', 8))`
    const result = await this.query(query, [])
    return result
  }

  public authenticate = async (
    email: string,
    text: string
  ): Promise<QueryResult> => {
    const query = `SELECT _id FROM users WHERE _email = '${email}' AND _password = crypt('${text}', _password)`
    const result = await this.query(query, [])
    return result
  }
}
