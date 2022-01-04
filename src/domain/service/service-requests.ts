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
import { IUserDto } from 'domain/models/user-model'
import { UniqueId } from 'domain/value/uid-value'

abstract class ServiceRequest<T> {
  protected _item: T

  protected _requestingUser: IUserDto | undefined

  constructor(item: T, requestingUser?: IUserDto) {
    this._item = item
    this._requestingUser = requestingUser
  }
}

export class UserRequest extends ServiceRequest<IUserDto> {
  public get user(): IUserDto {
    return this._item
  }

  private constructor(user: IUserDto, requestingUser?: IUserDto) {
    super(user, requestingUser)
  }

  public static create(user: IUserDto, requestingUser?: IUserDto): UserRequest {
    return new UserRequest(user, requestingUser)
  }
}

export class UuidRequest extends ServiceRequest<UniqueId> {
  public get id(): UniqueId {
    return this._item
  }

  private constructor(id: UniqueId, requestingUser?: IUserDto) {
    super(id, requestingUser)
  }

  public static create(id: string, requestingUser?: IUserDto): UuidRequest {
    return new UuidRequest(UniqueId.create(id), requestingUser)
  }
}

export class StringRequest extends ServiceRequest<string> {
  public get item(): string {
    return this._item
  }

  private constructor(item: string, requestingUser?: IUserDto) {
    super(item, requestingUser)
  }

  public static create(item: string, requestingUser?: IUserDto): StringRequest {
    return new StringRequest(item, requestingUser)
  }
}
