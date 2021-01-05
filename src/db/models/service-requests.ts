/**
 * Request models.
 * @author {@link https://github.com/jmg1138 jmg1138}
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
