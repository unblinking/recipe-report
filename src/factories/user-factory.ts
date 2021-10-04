/**
 * User factory.
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
