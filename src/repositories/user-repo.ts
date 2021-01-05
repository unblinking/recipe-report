/**
 * User repository.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** Internal imports. */
import { BaseRepo } from './base-repo'
import { UserModel } from '../db/models/user-model'
import { PoolClient } from 'pg'

const USERS_TABLE: string = `users`

export class UserRepo extends BaseRepo<UserModel> {
  constructor(db: PoolClient) {
    super(db, USERS_TABLE)
  }

  public countByUsername = async (username: string): Promise<number> => {
    const query = `SELECT username FROM ${USERS_TABLE} WHERE username = $1`
    const result = await this.db.query(query, [username])
    const count = result.rowCount
    return count
  }

  public countByEmailAddress = async (
    email_address: string
  ): Promise<number> => {
    const query = `SELECT email_address FROM ${USERS_TABLE} WHERE email_address = $1`
    const result = await this.db.query(query, [email_address])
    const count = result.rowCount
    return count
  }
}
