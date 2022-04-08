/**
 * Account model.
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
import type { IAccount } from '@recipe-report/domain/interfaces'
import { AccountMap } from '@recipe-report/domain/maps'
import { Err, errClient, Model } from '@recipe-report/domain/models'
import type { DisplayName, TimeZone, UniqueId } from '@recipe-report/domain/values'

export class Account extends Model<IAccount> {
  public get id(): UniqueId {
    return this._id
  }

  public get name(): DisplayName {
    return this._props.name
  }

  public get description(): string | undefined {
    return this._props.description
  }

  public get contact_user_id(): UniqueId {
    return this._props.contact_user_id
  }

  public get location_code(): string | undefined {
    return this._props.location_code
  }

  public get time_zone(): TimeZone | undefined {
    return this._props.time_zone
  }

  public get address_country(): string | undefined {
    return this._props.address_country
  }

  public get address_locality(): string | undefined {
    return this._props.address_locality
  }

  public get address_region(): string | undefined {
    return this._props.address_region
  }

  public get address_post_office_box(): string | undefined {
    return this._props.address_post_office_box
  }

  public get address_postal_code(): string | undefined {
    return this._props.address_postal_code
  }

  public get address_street(): string | undefined {
    return this._props.address_street
  }

  public get date_created(): Date | undefined {
    return this._props.date_created
  }

  public get date_deleted(): Date | undefined {
    return this._props.date_deleted
  }

  private constructor(props: IAccount, id?: UniqueId) {
    super(props, id)
  }

  public static create(props: IAccount, id?: UniqueId): Account {
    if (!AccountMap.isAccount(props)) {
      throw new Err(`MISSING_REQ`, `Account: ${errClient.MISSING_REQ}`)
    }
    return new Account(props, id)
  }
}
