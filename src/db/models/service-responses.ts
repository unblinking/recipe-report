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
 */

interface IServiceResponse<T> {
  success?: boolean
  error?: Error
  item?: T
}

abstract class ServiceResponse<T> implements IServiceResponse<T> {
  private state: IServiceResponse<T> = {}

  constructor(success: boolean = false, error?: Error, item?: T) {
    this.setSuccess(success)
    this.setError(error)
    this.setItem(item)
  }

  public get success(): boolean | undefined {
    return this.state.success
  }
  public setSuccess(success: boolean | undefined): void {
    this.state.success = success
  }

  public get error(): Error | undefined {
    return this.state.error
  }
  public setError(error: Error | undefined): void {
    this.state.error = error
  }

  public get item(): T | undefined {
    return this.state.item
  }
  public setItem(item: T | undefined): void {
    this.state.item = item
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
