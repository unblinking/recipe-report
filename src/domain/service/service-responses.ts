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
import { Err } from 'domain/models/err-model'
import { IUserDto } from 'domain/models/user-model'

import { httpStatusValueType, outcomes, outcomeValueType } from 'data/constants'

abstract class ServiceResponse<T> {
  // What was the outcome?
  // Did we have succcess, fail, or error?
  protected _outcome: outcomeValueType

  // Err object.
  // An error happened during the request.
  // This could be from an outcome of FAIL or ERROR.
  protected _err?: Err

  // Item requested.
  // If some item was requested, respond with the item here.
  // Examples: a user object, or an authentication token.
  protected _item?: T

  // HTTP status code.
  // @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
  // Must be one of the defined constants of type httpStatusValueType.
  protected _statusCode?: httpStatusValueType

  public get outcome(): outcomeValueType {
    return this._outcome
  }

  public get err(): Err | undefined {
    return this._err
  }

  public get item(): T | undefined {
    return this._item
  }

  public get statusCode(): httpStatusValueType | undefined {
    return this._statusCode
  }

  // Outcome is assumed an error unless explicitly set otherwise.
  constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    err?: Err,
    item?: T,
    statusCode?: httpStatusValueType,
  ) {
    this._outcome = outcome
    this._err = err
    this._item = item
    this._statusCode = statusCode
  }
}

export class UserResponse extends ServiceResponse<IUserDto> {}

export class StringResponse extends ServiceResponse<string> {}
