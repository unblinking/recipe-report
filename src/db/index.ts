/**
 * PostgreSQL database access.
 * @see {@link https://www.postgresql.org/ PostgreSQL}
 */

import { Pool, PoolClient, QueryResult } from 'pg'
import { logger } from '../wrappers/log'

/**
 * `node-postgres` wrapper.
 * @see {@link https://node-postgres.com/ node-postgres}
 * @see {@link https://node-postgres.com/guides/project-structure Suggested Project Structure Using async/await}
 */
export class PostgreSQL {
  private pool: Pool = new Pool({
    user: process.env.DB_USER as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_DATABASE as string,
    password: process.env.DB_PASSWORD as string,
    port: parseInt(process.env.DB_PORT as string, 10),
  })

  /**
   * Run a single query using pool.query and get the query results back.
   *
   * @memberof PostgreSQL
   * @returns The QueryResult object.
   */
  public query = async (
    text: string,
    params: Array<string>
  ): Promise<QueryResult> => {
    const start: number = Date.now()
    const result: QueryResult<never> = await this.pool.query(text, params)
    const duration: number = Date.now() - start
    logger.info(`Executed query. ${text}, ${duration}, ${result.rowCount}`)
    return result
  }

  /**
   * Check out a client using pool.connect. Will log a warning when the client
   * remains checked out for longer than five seconds without releasing.
   *
   * @memberof PostgreSQL
   * @returns The PoolClient object.
   */
  public getClient = async (): Promise<PoolClient> => {
    const client: PoolClient = await this.pool.connect()
    const release = client.release // Make a backup client.release.
    const timeout: NodeJS.Timeout = setTimeout(() => {
      logger.warn(`A pg client has been out for more than 5 seconds!`)
    }, 5000)
    client.release = (): void => {
      // Override client.release.
      clearTimeout(timeout)
      client.release = release // Reset client.release.
      return release.apply(client)
    }
    return client
  }

  /**
   * Hash and salt a string.
   * The pgcrypto module provides cryptographic functions for PostgreSQL.
   * Using the pgcrypto crypt function, and gen_salt with the blowfish algorithm
   * and iteration count of 8.
   *
   * @memberof PostgreSQL
   * @see {@link https://www.postgresql.org/docs/8.3/pgcrypto.html pgcrypto}
   * @returns The hashed and salted string.
   */
  public hashAndSalt = async (text: string): Promise<QueryResult> => {
    const query: string = `SELECT crypt('${text}', gen_salt('bf', 8))`
    const result = await this.query(query, [])
    return result
  }

  /**
   * Authenticate a user.
   * Given a user's email and plain text password, use the pgcrypto module to
   * determine if the password is correct. It will compare the password hash
   * that we have in the database to a hash of the plaintext password we were
   * given.
   *
   * @memberof PostgreSQL
   * @returns The QueryResult object containing the user.id value for the
   * authenticated user, or no rows if authentication failed.
   */
  public authenticate = async (
    email: string,
    text: string
  ): Promise<QueryResult> => {
    const query = `SELECT id FROM users WHERE email = '${email}' AND password = crypt('${text}', password)`
    const result = await this.query(query, [])
    return result
  }
}
