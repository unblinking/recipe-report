/**
 * Response models.
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

interface IServiceResponse<T> {
  success?: boolean
  fail?: boolean
  error?: Error
  item?: T
  statusCode?: number
}

abstract class ServiceResponse<T> implements IServiceResponse<T> {
  private state: IServiceResponse<T> = {}

  constructor(
    success: boolean = false,
    fail: boolean = false,
    error?: Error,
    item?: T,
    statusCode?: number
  ) {
    this.setSuccess(success)
    this.setFail(fail)
    this.setError(error)
    this.setItem(item)
    this.setStatusCode(statusCode)
  }

  // Success or not?
  // Did the service do what it wanted to do successfully?
  // This would normally return a status code 200.
  public get success(): boolean | undefined {
    return this.state.success
  }
  public setSuccess(success: boolean | undefined): void {
    this.state.success = success
  }

  // Fail or not?
  // Did the service have some problem caused by the client?
  // This would normally return a status code 400.
  public get fail(): boolean | undefined {
    return this.state.fail
  }
  public setFail(fail: boolean | undefined): void {
    this.state.fail = fail
  }

  // Error object.
  // An error happened during the request.
  // This would normally return a status code 500.
  public get error(): Error | undefined {
    return this.state.error
  }
  public setError(error: Error | undefined): void {
    this.state.error = error
  }

  // Item requested.
  // If some item was requested, respond with the item here.
  // Examples: a user object, or an authentication token.
  public get item(): T | undefined {
    return this.state.item
  }
  public setItem(item: T | undefined): void {
    this.state.item = item
  }

  // HTTP status code.
  // @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
  // Depending on success (200), fail(400), or error (500), this should return a
  // proper status code. Could be any standard HTTP status code, but it would be
  // nice if we could limit to the three main status codes for simplicity.
  public get statusCode(): number | undefined {
    return this.state.statusCode
  }
  public setStatusCode(statusCode: number | undefined): void {
    this.state.statusCode = statusCode
  }
}

export class UserRegistrationResponse<
  UserModel
> extends ServiceResponse<UserModel> {}

export class UserActivationResponse<
  UserModel
> extends ServiceResponse<UserModel> {}

export class UserAuthenticationResponse<
  AuthenticationModel
> extends ServiceResponse<AuthenticationModel> {}
