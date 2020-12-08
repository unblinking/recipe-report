/**
 * User repository.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** Internal imports. */
import { BaseRepo } from './baserepo'
import { UserModel } from '../db/models/usermodel'

export class UserRepo extends BaseRepo<UserModel> {}
