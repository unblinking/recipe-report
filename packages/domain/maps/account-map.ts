/**
 * Account mapper.
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
import type { AccountDto } from '@recipe-report/domain/dtos'
import type { IAccount } from '@recipe-report/domain/interfaces'
import { Account, Err, errInternal } from '@recipe-report/domain/models'
import { DisplayName, TimeZone, UniqueId } from '@recipe-report/domain/values'

export class AccountMap {
  public static dtoToDomain(accountDto: AccountDto): Account {
    if (!this.isAccount(accountDto)) {
      throw new Err(`DOMAIN_OBJECT`, `AccountMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Account.create(
      {
        name: DisplayName.create(accountDto.name),
        description: accountDto.description,
        contact_user_id: UniqueId.create(accountDto.contact_user_id),
        location_code: accountDto.location_code,
        time_zone: accountDto.time_zone ? TimeZone.create(accountDto.time_zone) : undefined,
        address_country: accountDto.address_country,
        address_locality: accountDto.address_locality,
        address_region: accountDto.address_region,
        address_post_office_box: accountDto.address_post_office_box,
        address_postal_code: accountDto.address_postal_code,
        address_street: accountDto.address_street,
        date_created: accountDto.date_created ? new Date(accountDto.date_created) : undefined,
        date_deleted: accountDto.date_deleted ? new Date(accountDto.date_deleted) : undefined,
      },
      UniqueId.create(accountDto.id),
    )
  }

  public static dbToDomain(dbResult: AccountDto, id: string): Account {
    if (!this.isAccount(dbResult)) {
      throw new Err(`DOMAIN_OBJECT`, `AccountMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Account.create(
      {
        name: DisplayName.create(dbResult.name),
        description: dbResult.description,
        contact_user_id: UniqueId.create(dbResult.contact_user_id),
        location_code: dbResult.location_code,
        time_zone: dbResult.time_zone ? TimeZone.create(dbResult.time_zone) : undefined,
        address_country: dbResult.address_country,
        address_locality: dbResult.address_locality,
        address_region: dbResult.address_region,
        address_post_office_box: dbResult.address_post_office_box,
        address_postal_code: dbResult.address_postal_code,
        address_street: dbResult.address_street,
        date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
        date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
      },
      UniqueId.create(id),
    )
  }

  public static domainToDto(account: Account): AccountDto {
    return {
      id: account.id.value,
      name: account.name.value,
      description: account.description,
      contact_user_id: account.contact_user_id.value,
      location_code: account.location_code,
      time_zone: account.time_zone?.value,
      address_country: account.address_country,
      address_locality: account.address_locality,
      address_region: account.address_region,
      address_post_office_box: account.address_post_office_box,
      address_postal_code: account.address_postal_code,
      address_street: account.address_street,
      date_created: account.date_created?.toString(),
      date_deleted: account.date_deleted?.toString(),
    }
  }

  // Type-guard using a type-predicate method.
  public static isAccount(raw: unknown): raw is IAccount {
    if (!(raw as IAccount).name) return false
    if (!(raw as IAccount).contact_user_id) return false
    return true
  }
}
