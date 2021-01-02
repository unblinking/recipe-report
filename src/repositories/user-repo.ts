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
}
