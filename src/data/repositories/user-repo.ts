/**
 * User repository.
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

import { IUserAuthenticationRequest } from '../../domain/models/service-requests'
import { UserModel } from '../../domain/models/user-model'

import { dbTables } from '../constants'
import { BaseRepo, IBaseRepo } from './base-repo'

export interface IUserRepo extends IBaseRepo<UserModel> {
  countByUsername(username: string): Promise<number>
  countByEmailAddress(email_address: string): Promise<number>
  hashAndSalt(password: string): Promise<QueryResult>
  authenticate(props: IUserAuthenticationRequest): Promise<QueryResult>
}

export class UserRepo extends BaseRepo<UserModel> implements IUserRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.USERS)
  }

  public countByUsername = async (username: string): Promise<number> => {
    const query = `SELECT username FROM ${dbTables.USERS} WHERE username = $1`
    const result = await this.client.query(query, [username])
    const count = result.rowCount
    return count
  }

  public countByEmailAddress = async (
    email_address: string,
  ): Promise<number> => {
    const query = `SELECT email_address FROM ${dbTables.USERS} WHERE email_address = $1`
    const result = await this.client.query(query, [email_address])
    const count = result.rowCount
    return count
  }

  /**
   * Hash and salt a string.
   *
   * The pgcrypto module provides cryptographic functions for PostgreSQL.
   * Using the pgcrypto crypt function, and gen_salt with the blowfish algorithm
   * and iteration count of 8.
   *
   * @memberof DataAccessLayer
   * @see {@link https://www.postgresql.org/docs/8.3/pgcrypto.html pgcrypto}
   * @returns The hashed and salted string.
   */
  public hashAndSalt = async (password: string): Promise<QueryResult> => {
    const query: string = `SELECT crypt($1, gen_salt('bf', 8))`
    // Use this.pool.query, so that this query isn't logged like other queries.
    const result = await this.client.query(query, [password])
    return result
  }

  /**
   * Authenticate a user.
   *
   * Given a user's email and plain text password, use the pgcrypto module to
   * determine if the password is correct. It will compare the password hash
   * that we have in the database to a hash of the plaintext password we were
   * given.
   *
   * @memberof DataAccessLayer
   * @returns The QueryResult object containing the user.id value for the
   * authenticated user, or no rows if authentication failed.
   */
  public authenticate = async (
    props: IUserAuthenticationRequest,
  ): Promise<QueryResult> => {
    const query = `SELECT id FROM users WHERE email_address = $1 AND password = crypt($2, password)`
    // Use this.pool.query, so that this query isn't logged like other queries.
    const result = await this.client.query(query, [
      props.email_address,
      props.password,
    ])
    return result
  }
}
