/**
 * User model.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/recipe-report}
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
import type { IUser } from '@recipe-report/domain/interfaces'
import { UserMap } from '@recipe-report/domain/maps'
import { Account, Model, Err, errClient } from '@recipe-report/domain/models'
import type { DisplayName, EmailAddress, Password, UniqueId } from '@recipe-report/domain/values'

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
