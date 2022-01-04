/**
 * User mapper.
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
import { Err, errInternal } from 'domain/models/err-model'
import { IUser, IUserDto, User } from 'domain/models/user-model'
import { EmailAddress } from 'domain/value/email-address-value'
import { Password } from 'domain/value/password-value'
import { UniqueId } from 'domain/value/uid-value'
import { Username } from 'domain/value/username-value'

export class UserMap {
  public static dtoToDomain(userDto: IUserDto): User {
    if (!this.isUser(userDto)) {
      throw new Err(`DOMAIN_OBJECT`, `UserMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return User.create(
      {
        name: Username.create(userDto.name),
        password: Password.create(userDto.password),
        email_address: EmailAddress.create(userDto.email_address),
        date_created: userDto.date_created ? new Date(userDto.date_created) : undefined,
        date_activated: userDto.date_activated ? new Date(userDto.date_activated) : undefined,
        date_last_login: userDto.date_last_login ? new Date(userDto.date_last_login) : undefined,
        date_deleted: userDto.date_deleted ? new Date(userDto.date_deleted) : undefined,
      },
      UniqueId.create(userDto.id),
    )
  }

  public static dbToDomain(dbResult: IUserDto, id: string): User {
    if (!this.isUser(dbResult)) {
      throw new Err(`DOMAIN_OBJECT`, `UserMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return User.create(
      {
        name: Username.create(dbResult.name),
        password: Password.create(dbResult.password),
        email_address: EmailAddress.create(dbResult.email_address),
        date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
        date_activated: dbResult.date_activated ? new Date(dbResult.date_activated) : undefined,
        date_last_login: dbResult.date_last_login ? new Date(dbResult.date_last_login) : undefined,
        date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
      },
      UniqueId.create(id),
    )
  }

  public static domainToDto(user: User): IUserDto {
    return {
      id: user.id.value,
      name: user.name.value,
      password: user.password.value,
      email_address: user.email_address.value,
      date_created: user.date_created?.toString(),
      date_activated: user.date_activated?.toString(),
      date_last_login: user.date_last_login?.toString(),
      date_deleted: user.date_deleted?.toString(),
    }
  }

  // Type-guard using a type-predicate method.
  public static isUser(raw: unknown): raw is IUser {
    if (!(raw as IUser).name) return false
    if (!(raw as IUser).password) return false
    if (!(raw as IUser).email_address) return false
    return true
  }
}
