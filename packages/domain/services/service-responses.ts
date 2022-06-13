/**
 * Response models.
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
import type { httpStatusValueType, outcomeValueType } from '@recipe-report/data'
import { httpStatus, outcomes } from '@recipe-report/data'
import type { AccountDto, FeatureDto, RoleDto, UserDto } from '@recipe-report/domain/dtos'
import type { Err } from '@recipe-report/domain/models'

abstract class ServiceResponse<T> {
  // What was the outcome?
  // Did we have succcess, fail, or error?
  protected _outcome: outcomeValueType

  // HTTP status code.
  // @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
  // Must be one of the defined constants of type httpStatusValueType.
  protected _statusCode: httpStatusValueType

  // Item requested.
  // If some item was requested, respond with the item here.
  // Examples: a user object, or an authentication token.
  protected _item?: T | undefined

  // Err object.
  // An error happened during the request.
  // This could be from an outcome of FAIL or ERROR.
  protected _err?: Err | undefined

  public get outcome(): outcomeValueType {
    return this._outcome
  }

  public get statusCode(): httpStatusValueType {
    return this._statusCode
  }

  public get item(): T | undefined {
    return this._item
  }

  public get err(): Err | undefined {
    return this._err
  }

  // Outcome is assumed an error unless explicitly set otherwise.
  public constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: T,
    err?: Err,
  ) {
    this._outcome = outcome
    this._err = err
    this._item = item
    this._statusCode = statusCode
  }
}

export class AccountResponse extends ServiceResponse<AccountDto> {
  private constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: AccountDto,
    err?: Err,
  ) {
    super(outcome, statusCode, item, err)
  }

  public static success(item: AccountDto): AccountResponse {
    return new AccountResponse(outcomes.SUCCESS, httpStatus.OK, item)
  }

  public static fail(err: Err): AccountResponse {
    return new AccountResponse(outcomes.FAIL, httpStatus.BAD_REQUEST, undefined, err)
  }

  public static error(err: Err): AccountResponse {
    return new AccountResponse(outcomes.ERROR, httpStatus.INTERNAL_ERROR, undefined, err)
  }
}

export class FeatureResponse extends ServiceResponse<FeatureDto> {
  private constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: FeatureDto,
    err?: Err,
  ) {
    super(outcome, statusCode, item, err)
  }

  public static success(item: FeatureDto): FeatureResponse {
    return new FeatureResponse(outcomes.SUCCESS, httpStatus.OK, item)
  }

  public static fail(err: Err): FeatureResponse {
    return new FeatureResponse(outcomes.FAIL, httpStatus.BAD_REQUEST, undefined, err)
  }

  public static error(err: Err): FeatureResponse {
    return new FeatureResponse(outcomes.ERROR, httpStatus.INTERNAL_ERROR, undefined, err)
  }
}

export class RoleResponse extends ServiceResponse<RoleDto> {
  private constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: RoleDto,
    err?: Err,
  ) {
    super(outcome, statusCode, item, err)
  }

  public static success(item: RoleDto): RoleResponse {
    return new RoleResponse(outcomes.SUCCESS, httpStatus.OK, item)
  }

  public static fail(err: Err): RoleResponse {
    return new RoleResponse(outcomes.FAIL, httpStatus.BAD_REQUEST, undefined, err)
  }

  public static error(err: Err): RoleResponse {
    return new RoleResponse(outcomes.ERROR, httpStatus.INTERNAL_ERROR, undefined, err)
  }
}

export class StringResponse extends ServiceResponse<string> {
  private constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: string,
    err?: Err,
  ) {
    super(outcome, statusCode, item, err)
  }

  public static success(item: string): StringResponse {
    return new StringResponse(outcomes.SUCCESS, httpStatus.OK, item)
  }

  public static fail(err: Err): StringResponse {
    return new StringResponse(outcomes.FAIL, httpStatus.BAD_REQUEST, undefined, err)
  }

  public static error(err: Err): StringResponse {
    return new StringResponse(outcomes.ERROR, httpStatus.INTERNAL_ERROR, undefined, err)
  }
}

export class UserResponse extends ServiceResponse<UserDto> {
  private constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: UserDto,
    err?: Err,
  ) {
    super(outcome, statusCode, item, err)
  }

  public static success(item: UserDto): UserResponse {
    return new UserResponse(outcomes.SUCCESS, httpStatus.OK, item)
  }

  public static fail(err: Err): UserResponse {
    return new UserResponse(outcomes.FAIL, httpStatus.BAD_REQUEST, undefined, err)
  }

  public static error(err: Err): UserResponse {
    return new UserResponse(outcomes.ERROR, httpStatus.INTERNAL_ERROR, undefined, err)
  }
}
