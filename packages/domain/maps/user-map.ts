/**
 * User mapper.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/unblinking/recipe-report}
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
import type { UserDto } from '@recipe-report/domain/dtos'
import type { IUser } from '@recipe-report/domain/interfaces'
import { AccountMap } from '@recipe-report/domain/maps'
import { Account, Err, errInternal, User } from '@recipe-report/domain/models'
import { DisplayName, EmailAddress, Password, UniqueId } from '@recipe-report/domain/values'

export class UserMap {
  public static dtoToDomain(userDto: UserDto): User {
    if (!this.isUser(userDto)) {
      throw new Err(`DOMAIN_OBJECT`, `UserMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return User.create(
      {
        name: DisplayName.create(userDto.name),
        password: Password.create(userDto.password),
        email_address: EmailAddress.create(userDto.email_address),
        accounts: userDto.accounts
          ? userDto.accounts.map((account) => AccountMap.dtoToDomain(account))
          : undefined,
        date_created: userDto.date_created ? new Date(userDto.date_created) : undefined,
        date_activated: userDto.date_activated ? new Date(userDto.date_activated) : undefined,
        date_last_login: userDto.date_last_login ? new Date(userDto.date_last_login) : undefined,
        date_deleted: userDto.date_deleted ? new Date(userDto.date_deleted) : undefined,
      },
      UniqueId.create(userDto.id),
    )
  }

  public static dbToDomain(dbResult: UserDto, id: string): User {
    if (!this.isUser(dbResult)) {
      throw new Err(`DOMAIN_OBJECT`, `UserMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return User.create(
      {
        name: DisplayName.create(dbResult.name),
        password: Password.create(dbResult.password),
        email_address: EmailAddress.create(dbResult.email_address),
        accounts: dbResult.accounts
          ? dbResult.accounts.map((account) =>
              // Using UniqueId.create() here because it can accept possible
              // null/undefined for the id and will always return a valid UUID.
              AccountMap.dbToDomain(account, UniqueId.create(account.id).value),
            )
          : undefined,
        date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
        date_activated: dbResult.date_activated ? new Date(dbResult.date_activated) : undefined,
        date_last_login: dbResult.date_last_login ? new Date(dbResult.date_last_login) : undefined,
        date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
      },
      UniqueId.create(id),
    )
  }

  public static domainToDto(user: User): UserDto {
    return {
      id: user.id.value,
      name: user.name.value,
      password: user.password.value,
      email_address: user.email_address.value,
      accounts: user.accounts?.map((account: Account) => AccountMap.domainToDto(account)),
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
