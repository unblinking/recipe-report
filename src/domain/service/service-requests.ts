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

abstract class ServiceRequest<T> {
  protected _item: T

  protected _requestingUser: IUserDto | undefined

  constructor(item: T, requestingUser?: IUserDto) {
    this._item = item
    this._requestingUser = requestingUser
  }
}

export class UserRegistrationRequest extends ServiceRequest<IUserDto> {
  public get user(): IUserDto {
    return this._item
  }

  private constructor(user: IUserDto, requestingUser?: IUserDto) {
    super(user, requestingUser)
  }

  public static create(user: IUserDto, requestingUser?: IUserDto): UserRegistrationRequest {
    return new UserRegistrationRequest(user, requestingUser)
  }
}

export class UserActivationRequest extends ServiceRequest<string> {
  public get token(): string {
    return this._item
  }

  private constructor(token: string, requestingUser?: IUserDto) {
    super(token, requestingUser)
  }

  public static create(token: string, requestingUser?: IUserDto): UserActivationRequest {
    return new UserActivationRequest(token, requestingUser)
  }
}

export class UserAuthenticationRequest extends ServiceRequest<IUserDto> {
  public get user(): IUserDto {
    return this._item
  }

  private constructor(user: IUserDto, requestingUser?: IUserDto) {
    super(user, requestingUser)
  }

  public static create(user: IUserDto, requestingUser?: IUserDto): UserAuthenticationRequest {
    return new UserAuthenticationRequest(user, requestingUser)
  }
}
