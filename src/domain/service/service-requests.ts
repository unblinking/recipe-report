/**
 * Request models.
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
import { IFeatureDto } from 'domain/models/feature-model'
import { IRoleDto } from 'domain/models/role-model'
import { IUserDto } from 'domain/models/user-model'
import { UniqueId } from 'domain/value/uid-value'

abstract class ServiceRequest<T> {
  protected _item: T

  protected authorizedId: UniqueId | undefined

  constructor(item: T, authorizedId?: UniqueId) {
    this._item = item
    this.authorizedId = authorizedId
  }
}

export class FeatureRequest extends ServiceRequest<IFeatureDto> {
  public get feature(): IFeatureDto {
    return this._item
  }

  private constructor(feature: IFeatureDto, authorizedId?: UniqueId) {
    super(feature, authorizedId)
  }

  public static create(feature: IFeatureDto, authorizedId?: UniqueId): FeatureRequest {
    return new FeatureRequest(feature, authorizedId)
  }
}

export class RoleRequest extends ServiceRequest<IRoleDto> {
  public get role(): IRoleDto {
    return this._item
  }

  private constructor(role: IRoleDto, authorizedId?: UniqueId) {
    super(role, authorizedId)
  }

  public static create(role: IRoleDto, authorizedId?: UniqueId): RoleRequest {
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

export class UserRequest extends ServiceRequest<IUserDto> {
  public get user(): IUserDto {
    return this._item
  }

  private constructor(user: IUserDto, authorizedId?: UniqueId) {
    super(user, authorizedId)
  }

  public static create(user: IUserDto, authorizedId?: UniqueId): UserRequest {
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

  public static create(id: string, authorizedId?: UniqueId): UuidRequest {
    return new UuidRequest(UniqueId.create(id), authorizedId)
  }
}
