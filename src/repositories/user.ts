/**
 * User repository.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import { QueryResult } from 'pg'

/** Internal imports. */
import BaseRepo from './base'
import UserModel from '../db/models/user'

/**
 * User repository interface.
 *
 * @interface IUserRepo
 */
interface IUserRepo {
  createUser(model: UserModel): Promise<QueryResult>
  getUser(id: string): Promise<QueryResult>
}

class UserRepo extends BaseRepo<UserModel> implements IUserRepo {
  public createUser = async (model: UserModel): Promise<QueryResult> => {
    const result = this.createOne(model)
    return result
  }

  public getUser = async (id: string): Promise<QueryResult> => {
    const result = this.findOneById(id)
    return result
  }
}

export default UserRepo
