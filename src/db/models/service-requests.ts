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
 */

import { UserModel } from './user-model'

/**
 * Service request base interface.
 *
 * @interface IServiceRequest
 * @template T
 */
interface IServiceRequest<T> {
  // The item contains the details needed to complete the request.
  item?: T

  // The user who is making the request.
  user?: UserModel
}

/**
 * Service request abstract/base class.
 *
 * @abstract
 * @class ServiceRequest
 * @implements {IServiceRequest<T>}
 * @template T
 */
abstract class ServiceRequest<T> implements IServiceRequest<T> {
  public state: IServiceRequest<T> = {}

  constructor(item?: T, user?: UserModel) {
    this.setItem(item)
    this.setUser(user)
  }

  public get item(): T | undefined {
    return this.state.item
  }
  public setItem(item: T | undefined): void {
    this.state.item = item
  }

  public get user(): UserModel | undefined {
    return this.state.user
  }
  public setUser(user: UserModel | undefined): void {
    this.state.user = user
  }
}

/**
 * User registration service request interface.
 *
 * @interface IUserRegistrationRequest
 */
interface IUserRegistrationRequest {
  username?: string
  email_address?: string
  password?: string
}

/**
 * User registration service request concrete class.
 *
 * @export
 * @class UserRegistrationRequest
 * @extends {ServiceRequest<IUserRegistrationRequest>}
 */
export class UserRegistrationRequest extends ServiceRequest<IUserRegistrationRequest> {
  constructor(props: IUserRegistrationRequest) {
    super()
    const item: IUserRegistrationRequest = props
    super.setItem(item)
  }
}

/**
 * User activation service request interface.
 *
 * @interface IUserActivationRequest
 */
interface IUserActivationRequest {
  token?: string
}

/**
 * User activation service request concrete class.
 *
 * @export
 * @class UserActivationRequest
 * @extends {ServiceRequest<IUserActivationRequest>}
 */
export class UserActivationRequest extends ServiceRequest<IUserActivationRequest> {
  constructor(props: IUserActivationRequest) {
    super()
    const item: IUserActivationRequest = props
    super.setItem(item)
  }
}

/**
 * User authentication service request interface.
 *
 * @interface IUserAuthenticationRequest
 */
export interface IUserAuthenticationRequest {
  email_address?: string
  password?: string
}

/**
 * User authentication service request concrete class.
 *
 * @export
 * @class UserAuthenticationRequest
 * @extends {ServiceRequest<IUserAuthenticationRequest>}
 */
export class UserAuthenticationRequest extends ServiceRequest<IUserAuthenticationRequest> {
  constructor(props: IUserAuthenticationRequest) {
    super()
    const item: IUserAuthenticationRequest = props
    super.setItem(item)
  }
}
