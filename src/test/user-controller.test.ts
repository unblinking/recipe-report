/**
 * UserController unit tests.
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
import { Container } from 'inversify'
import 'reflect-metadata'
import request from 'supertest'

import { UserController } from 'api/controllers/user-controller'

import { mockExpressApp, mockUserDto, MockUserServiceSuccess } from './test-factory'

describe(`UserController success`, () => {
  let container: Container

  beforeEach(() => {
    container = new Container()
    container.bind<UserController>('userController').to(UserController)
    container.bind<MockUserServiceSuccess>(Symbol.for('IUserService')).to(MockUserServiceSuccess)
  })

  test(`Creates a user.`, async () => {
    // Arrange.
    const controller: UserController = container.get('userController')
    const router = controller.router
    mockExpressApp.use('/', router)

    // Act.
    const res = await request(mockExpressApp)
      .post('/')
      .set('Content-type', 'application/json')
      .send(mockUserDto)

    // Assert.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    console.log(res.body)
  })
})
