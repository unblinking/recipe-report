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
import {
  httpStatusValueType,
  outcomes,
  outcomeValueType,
} from '../../data/constants'

import { Err } from '../../utils'

interface IServiceResponse<T> {
  outcome?: outcomeValueType
  err?: Err
  item?: T
  statusCode?: httpStatusValueType
}

abstract class ServiceResponse<T> implements IServiceResponse<T> {
  private _state: IServiceResponse<T> = {}

  // Outcome is assumed an error unless explicitly set otherwise.
  constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    err?: Err,
    item?: T,
    statusCode?: httpStatusValueType,
  ) {
    this.setOutcome(outcome)
    this.setErr(err)
    this.setItem(item)
    this.setStatusCode(statusCode)
  }

  // What was the outcome?
  // Did we have succcess, fail, or error?
  public get outcome(): outcomeValueType | undefined {
    return this._state.outcome
  }
  public setOutcome(outcome: outcomeValueType | undefined): void {
    this._state.outcome = outcome
  }

  // Err object.
  // An error happened during the request.
  // This could be from an outcome of FAIL or ERROR.
  public get err(): Err | undefined {
    return this._state.err
  }
  public setErr(err: Err | undefined): void {
    this._state.err = err
  }

  // Item requested.
  // If some item was requested, respond with the item here.
  // Examples: a user object, or an authentication token.
  public get item(): T | undefined {
    return this._state.item
  }
  public setItem(item: T | undefined): void {
    this._state.item = item
  }

  // HTTP status code.
  // @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
  // Must be one of the defined constants of type httpStatusValueType.
  public get statusCode(): httpStatusValueType | undefined {
    return this._state.statusCode
  }
  public setStatusCode(statusCode: httpStatusValueType | undefined): void {
    this._state.statusCode = statusCode
  }
}

export class UserRegistrationResponse<
  UserModel,
> extends ServiceResponse<UserModel> {}

export class UserActivationResponse<
  UserModel,
> extends ServiceResponse<UserModel> {}

export class UserAuthenticationResponse<
  AuthenticationModel,
> extends ServiceResponse<AuthenticationModel> {}
