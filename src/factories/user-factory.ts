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
    const postgreSQL = new PostgreSQL()

    // Hash the provided plaintext password.
    // I wanted to put this in the user model, but could not find a great way
    // to put an async/await in the model.
    if (!props.password) throw new Error(`Password is not defined.`)
    const queryResult = await postgreSQL.hashAndSalt(props.password)
    if (queryResult.rowCount < 1 || !queryResult.rows[0].crypt)
      throw new Error(`Error hashing password.`)
    const hashedPassword = queryResult.rows[0].crypt

    // Set the hashed password in the properties we will use to
    // create the user object instance.
    props.password = hashedPassword

    // Set the current date that we are creating this user.
    props.date_created = new Date()

    // Instantiate the user object.
    const user: UserModel = new UserModel(props)

    // Return the user object.
    return user
  }
}
