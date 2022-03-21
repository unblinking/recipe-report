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
import type { UserDto } from '@recipe-report/domain/dtos'
import { Err, errClient, User } from '@recipe-report/domain/models'
import { UserRequest, UserResponse } from '@recipe-report/domain/services'
import { DisplayName, EmailAddress, Password, UniqueId } from '@recipe-report/domain/values'
import { injectable } from 'inversify'

export const mockUserDomain: User = User.create(
  {
    name: DisplayName.create(`noreplyuser`),
    password: Password.create(`$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`),
    email_address: EmailAddress.create(`noreply@recipe.report`),
    date_created: new Date(),
  },
  UniqueId.create(),
)

export const mockUserDtoNewComplete: UserDto = {
  name: 'foo',
  password: 'passwordfoo',
  email_address: 'foo@recipe.report',
}

export const mockUserDtoNewIncomplete: UserDto = {
  name: 'foo',
  email_address: 'foo@recipe.report',
}

export const mockUserDtoSavedComplete: UserDto = {
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
