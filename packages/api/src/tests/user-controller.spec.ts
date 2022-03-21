/**
 * UserController unit tests.
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
import { UserController } from '@recipe-report/api/controllers'
import express, { json } from 'express'
import { Container } from 'inversify'
import 'reflect-metadata'
import request from 'supertest'

import { MockUserServiceError, MockUserServiceFail, MockUserServiceSuccess } from './mocks'

describe(`UserController tests.`, () => {
  let container: Container

  beforeEach(() => {
    container = new Container()
  })

  test(`POST request with success response from service.`, async () => {
    // Arrange.
    container.bind<UserController>('userController').to(UserController)
    container.bind<MockUserServiceSuccess>(Symbol.for('IUserService')).to(MockUserServiceSuccess)
    const controller: UserController = container.get('userController')
    const router = controller.router
    const app = express().set('json spaces', 2).use(json())
    app.use('/', router)

    // Act.
    const res = await request(app).post('/').set('Content-type', 'application/json')

    // Assert.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    expect(res.statusCode).toBe(200)
    expect(res.ok).toBe(true)
    expect(res.body.status).toBe('success')
    expect(res.body.data.user).toBeDefined
  })

  test(`POST request with fail response from service.`, async () => {
    // Arrange.
    container.bind<UserController>('userController').to(UserController)
    container.bind<MockUserServiceFail>(Symbol.for('IUserService')).to(MockUserServiceFail)
    const controller: UserController = container.get('userController')
    const router = controller.router
    const app = express().set('json spaces', 2).use(json())
    app.use('/', router)

    // Act.
    const res = await request(app).post('/').set('Content-type', 'application/json')

    // Assert.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    expect(res.statusCode).toBe(400)
    expect(res.badRequest).toBe(true)
    expect(res.clientError).toBe(true)
    expect(res.body.status).toBe('fail')
    expect(res.body.message).toBeDefined
    expect(res.body.code).toBeDefined
  })

  test(`POST request with error response from service.`, async () => {
    // Arrange.
    container.bind<UserController>('userController').to(UserController)
    container.bind<MockUserServiceError>(Symbol.for('IUserService')).to(MockUserServiceError)
    const controller: UserController = container.get('userController')
    const router = controller.router
    const app = express().set('json spaces', 2).use(json())
    app.use('/', router)

    // Act.
    const res = await request(app).post('/').set('Content-type', 'application/json')

    // Assert.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8')
    expect(res.statusCode).toBe(500)
    expect(res.serverError).toBe(true)
    expect(res.error).toBeDefined
    expect(res.body.status).toBe('error')
    expect(res.body.message).toBe('Something went wrong.')
  })
})
