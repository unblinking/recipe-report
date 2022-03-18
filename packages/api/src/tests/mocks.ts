/**
 * Test factory.
 *
 * Create objects for use in unit testing.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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
import { injectable } from 'inversify'

import { Err, errClient } from 'domain/models/err-model'
import { IUserDto, User } from 'domain/models/user-model'
import { UserRequest } from 'domain/service/service-requests'
import { UserResponse } from 'domain/service/service-responses'
import { DisplayName } from 'domain/value/display-name-value'
import { EmailAddress } from 'domain/value/email-address-value'
import { Password } from 'domain/value/password-value'
import { UniqueId } from 'domain/value/uid-value'

export const mockUserDomain: User = User.create(
  {
    name: DisplayName.create(`noreplyuser`),
    password: Password.create(`$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`),
    email_address: EmailAddress.create(`noreply@recipe.report`),
    date_created: new Date(),
  },
  UniqueId.create(),
)

export const mockUserDtoNewComplete: IUserDto = {
  name: 'foo',
  password: 'passwordfoo',
  email_address: 'foo@recipe.report',
}

export const mockUserDtoNewIncomplete: IUserDto = {
  name: 'foo',
  email_address: 'foo@recipe.report',
}

export const mockUserDtoSavedComplete: IUserDto = {
  name: 'foo',
  password: 'passwordfoo',
  email_address: 'foo@recipe.report',
  date_created: new Date().toString(),
}

// Mock UserService that always returns success.
@injectable()
export class MockUserServiceSuccess {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(_req: UserRequest): Promise<UserResponse> {
    return UserResponse.success(mockUserDtoSavedComplete)
  }
}

// Mock UserService that always returns fail.
@injectable()
export class MockUserServiceFail {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(_req: UserRequest): Promise<UserResponse> {
    return UserResponse.fail(new Err('MISSING_REQ', errClient.MISSING_REQ))
  }
}

// Mock UserService that always returns error.
@injectable()
export class MockUserServiceError {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(_req: UserRequest): Promise<UserResponse> {
    return UserResponse.error(new Err('MISSING_REQ', errClient.MISSING_REQ))
  }
}
