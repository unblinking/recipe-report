/**
 * User factory.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { IUserModel, UserModel } from '../db/models/user-model'

interface IUserFactory {
  create(userProps: IUserModel): Promise<UserModel>
}

export class UserFactory implements IUserFactory {
  public async create(props: IUserModel): Promise<UserModel> {
    props.date_created = new Date()
    const user: UserModel = new UserModel(props)
    return user
  }
}

// TODO: Make the create user method async. Maybe have a request object for it instead of just passing these arguments?
