/**
 * User model.
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
import { Model } from 'domain/models/base'
import { EmailAddress } from 'domain/value-objects/email-address'
import { Password } from 'domain/value-objects/password'
import { UniqueId } from 'domain/value-objects/uid'
import { Username } from 'domain/value-objects/username'

import { errMsg } from 'data/constants'

import { Err } from 'root/utils'

export interface IUserDto {
  id?: string
  name?: string
  password?: string
  email_address?: string
  role?: string
  date_created?: string
  date_activated?: string
  date_last_login?: string
  date_deleted?: string
}

export interface IUser {
  name: Username
  password: Password
  email_address: EmailAddress
  role?: string
  date_created?: Date
  date_activated?: Date
  date_last_login?: Date
  date_deleted?: Date
}

export class User extends Model<IUser> {
  public get id(): UniqueId {
    return this._id
  }

  public get name(): Username {
    return this._props.name
  }

  public get password(): Password {
    return this._props.password
  }

  public get email_address(): EmailAddress {
    return this._props.email_address
  }

  public get role(): string | undefined {
    return this._props.role
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
    // If id is provided, verify it is valid.
    if (id && !new UniqueId(id.toString()).valid()) {
      throw new Err(`UID_INVALID`, errMsg.UID_INVALID)
    }
    return new User(props, id)
  }

  public isActive(): boolean {
    return this._props.date_activated ? true : false
  }

  public static toDomain(userDto: IUserDto): User {
    if (!isUser(userDto)) {
      throw new Err(`MISSING_REQ`, errMsg.MISSING_REQ)
    }
    return User.create(userDto)
  }

  public static toDto(user: User): IUserDto {
    return {
      id: user.id.toString(),
      name: user.name.toString(),
      password: user.password.toString(),
      email_address: user.email_address.toString(),
      role: user.role?.toString(),
      date_created: user.date_created?.toString(),
      date_activated: user.date_activated?.toString(),
      date_last_login: user.date_last_login?.toString(),
      date_deleted: user.date_deleted?.toString(),
    }
  }
}

export const isUser = (props: unknown): props is IUser => {
  if (!(props as IUser).name) return false
  if (!(props as IUser).password) return false
  if (!(props as IUser).email_address) return false
  return true
}

export const isUserAuth = (props: unknown): props is IUser => {
  if (!(props as IUser).password) return false
  if (!(props as IUser).email_address) return false
  return true
}
