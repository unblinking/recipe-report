/**
 * User model.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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
import { UserMap } from 'domain/maps/user-map'
import { Model } from 'domain/models/base-model'
import { Err, errClient } from 'domain/models/err-model'
import { DisplayName } from 'domain/value/display-name-value'
import { EmailAddress } from 'domain/value/email-address-value'
import { Password } from 'domain/value/password-value'
import { UniqueId } from 'domain/value/uid-value'

import { Account, IAccountDto } from './account-model'

export interface IUserDto {
  id?: string
  name?: string
  password?: string
  email_address?: string
  accounts?: IAccountDto[]
  date_created?: string
  date_activated?: string
  date_last_login?: string
  date_deleted?: string
}

export interface IUser {
  name: DisplayName
  password: Password
  email_address: EmailAddress
  accounts?: Account[]
  date_created?: Date
  date_activated?: Date
  date_last_login?: Date
  date_deleted?: Date
}

export class User extends Model<IUser> {
  public get id(): UniqueId {
    return this._id
  }

  public get name(): DisplayName {
    return this._props.name
  }

  public get password(): Password {
    return this._props.password
  }

  public get email_address(): EmailAddress {
    return this._props.email_address
  }

  public get accounts(): Account[] | undefined {
    return this._props.accounts
  }

  public get date_created(): Date | undefined {
    return this._props.date_created
  }

  public get date_activated(): Date | undefined {
    return this._props.date_activated
  }

  public get date_last_login(): Date | undefined {
    return this._props.date_last_login
  }

  public get date_deleted(): Date | undefined {
    return this._props.date_deleted
  }

  // Private constructor to control instantiation via factory method.
  private constructor(props: IUser, id?: UniqueId) {
    super(props, id)
  }

  // Factory method here instead of a factory class.
  public static create(props: IUser, id?: UniqueId): User {
    if (!UserMap.isUser(props)) {
      throw new Err(`MISSING_REQ`, `User: ${errClient.MISSING_REQ}`)
    }
    return new User(props, id)
  }

  public isActive(): boolean {
    return this._props.date_activated ? true : false
  }

  public setAccounts(accounts: Account[]): void {
    this._props.accounts = accounts
  }
}
