/**
 * User factory.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { IUserModel, UserModel } from '../db/models/user-model'
import { PostgreSQL } from '../db/index'

interface IUserFactory {
  create(userProps: IUserModel): Promise<UserModel>
}

export class UserFactory implements IUserFactory {
  public async create(props: IUserModel): Promise<UserModel> {
    // First, hash and salt the provided plaintext password.
    if (!props.password) throw new Error(`Password is not defined.`)
    const postgreSQL = new PostgreSQL()
    const queryResult = await postgreSQL.hashAndSalt(props.password)
    if (queryResult.rowCount < 1 || !queryResult.rows[0].crypt)
      throw new Error(`Error hashing password.`)
    const hashedAndSaltedPassword = queryResult.rows[0].crypt
    // Set the hashed and salted password in the properties we will use to
    // create the user object instance.
    props.password = hashedAndSaltedPassword
    // Set the current date that we are creating this user.
    props.date_created = new Date()
    // Instantiate the user object.
    const user: UserModel = new UserModel(props)
    // Return the user object.
    return user
  }
}
