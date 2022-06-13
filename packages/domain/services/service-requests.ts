/**
 * Service request models.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import type { AccountDto, FeatureDto, RoleDto, UserDto } from '@recipe-report/domain/dtos'
import { UniqueId } from '@recipe-report/domain/values'

abstract class ServiceRequest<T> {
  protected _item: T

  protected authorizedId: UniqueId | undefined

  constructor(item: T, authorizedId?: UniqueId) {
    this._item = item
    this.authorizedId = authorizedId
  }
}

export class AccountRequest extends ServiceRequest<AccountDto> {
  public get account(): AccountDto {
    return this._item
  }

  private constructor(account: AccountDto, authorizedId?: UniqueId) {
    super(account, authorizedId)
  }

  public static create(account: AccountDto, authorizedId?: UniqueId): AccountRequest {
    return new AccountRequest(account, authorizedId)
  }
}

export class FeatureRequest extends ServiceRequest<FeatureDto> {
  public get feature(): FeatureDto {
    return this._item
  }

  private constructor(feature: FeatureDto, authorizedId?: UniqueId) {
    super(feature, authorizedId)
  }

  public static create(feature: FeatureDto, authorizedId?: UniqueId): FeatureRequest {
    return new FeatureRequest(feature, authorizedId)
  }
}

export class RoleRequest extends ServiceRequest<RoleDto> {
  public get role(): RoleDto {
    return this._item
  }

  private constructor(role: RoleDto, authorizedId?: UniqueId) {
    super(role, authorizedId)
  }

  public static create(role: RoleDto, authorizedId?: UniqueId): RoleRequest {
    return new RoleRequest(role, authorizedId)
  }
}

export class StringRequest extends ServiceRequest<string> {
  public get item(): string {
    return this._item
  }

  private constructor(item: string, authorizedId?: UniqueId) {
    super(item, authorizedId)
  }

  public static create(item: string, authorizedId?: UniqueId): StringRequest {
    return new StringRequest(item, authorizedId)
  }
}

export class UserRequest extends ServiceRequest<UserDto> {
  public get user(): UserDto {
    return this._item
  }

  private constructor(user: UserDto, authorizedId?: UniqueId) {
    super(user, authorizedId)
  }

  public static create(user: UserDto, authorizedId?: UniqueId): UserRequest {
    return new UserRequest(user, authorizedId)
  }
}

export class UuidRequest extends ServiceRequest<UniqueId> {
  public get id(): UniqueId {
    return this._item
  }

  private constructor(id: UniqueId, authorizedId?: UniqueId) {
    super(id, authorizedId)
  }

  // The id must be defined here. Otherwise UniqueId.create will just create a new
  // UUID, and we don't want a UuidRequest to happen if no UUID has been provided.
  public static create(id: string, authorizedId?: UniqueId): UuidRequest {
    return new UuidRequest(UniqueId.create(id), authorizedId)
  }
}
