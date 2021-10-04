/**
 * Token related unit tests.
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

import { TestFactory } from './test-factory'
import { IUserModel } from '../db/models/user-model'
import { decodeToken, encodeToken, Payload, tokenType } from '../wrappers/token'

describe(`JSON Web Token actions.`, () => {
  test(`Encodes an activation JWT.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const userDto: IUserModel = testFactory.userNewDto()
    // Act.
    const token: string = encodeToken(
      userDto.id as string,
      tokenType.ACTIVATION,
      new Date().getTime()
    )
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Encodes an access JWT.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const userDto: IUserModel = testFactory.userNewDto()
    // Act.
    const token: string = encodeToken(
      userDto.id as string,
      tokenType.ACCESS,
      new Date().getTime()
    )
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Encodes an access JWT even when TTL is not defined.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const userDto: IUserModel = testFactory.userNewDto()
    // Act.
    const token: string = encodeToken(userDto.id as string, tokenType.ACCESS)
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Decodes an activation JWT.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenActivation()
    // Act.
    const payload: Payload = decodeToken(token)
    // Assert.
    expect(payload.id).toBeTruthy()
    expect(payload.type).toEqual(tokenType.ACTIVATION)
    expect(payload.iat).toBeTruthy()
    expect(payload.ttl).toBeTruthy()
  })

  test(`Decodes an access JWT.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenAccess()
    // Act.
    const payload: Payload = decodeToken(token)
    // Assert.
    expect(payload.id).toBeTruthy()
    expect(payload.type).toEqual(tokenType.ACCESS)
    expect(payload.iat).toBeTruthy()
    expect(payload.ttl).toBeTruthy()
  })

  test(`Fails to encode without JWT_SECRET.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const userDto: IUserModel = testFactory.userNewDto()
    const backupJwtSecret = process.env.JWT_SECRET
    delete process.env.JWT_SECRET
    // Act and assert.
    expect(() => {
      encodeToken(userDto.id as string, tokenType.ACCESS, new Date().getTime())
    }).toThrow(`JWT error. Secret key is not defined.`)
    process.env.JWT_SECRET = backupJwtSecret
  })

  test(`Fails to encode without User ID.`, () => {
    // Arrange, act, and assert.
    expect(() => {
      encodeToken(``, tokenType.ACCESS, new Date().getTime())
    }).toThrow(`JWT error. User ID is not defined.`)
  })

  test(`Fails to encode without token type.`, () => {
    // Arrange
    const testFactory: TestFactory = new TestFactory()
    const userDto: IUserModel = testFactory.userNewDto()
    // Act, and assert.
    expect(() => {
      encodeToken(userDto.id as string, tokenType.NONE, new Date().getTime())
    }).toThrow(`JWT error. Type is not defined.`)
  })

  test(`Fails to decodes without JWT_SECRET.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenActivation()
    const backupJwtSecret = process.env.JWT_SECRET
    delete process.env.JWT_SECRET
    // Act and assert.
    expect(() => {
      decodeToken(token)
    }).toThrow(`JWT error. Secret key is not defined.`)
    process.env.JWT_SECRET = backupJwtSecret
  })

  test(`Fails to decodes without token.`, () => {
    // Arrange, act, and assert.
    expect(() => {
      decodeToken(``)
    }).toThrow(`JWT error. Token is not defined.`)
  })
})
