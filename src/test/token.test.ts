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
 *
 * @module
 */
import { User } from 'domain/models/user-model'

import { JwtService, Payload, tokenType } from 'service/jwt-service'

import { TestFactory } from 'test/test-factory'

describe(`JSON Web Token actions.`, () => {
  test(`Encodes an activation JWT.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = new JwtService()
    // Act.
    const token: string = jwt.encode(
      user.id.value,
      tokenType.ACTIVATION,
      new Date().getTime(),
    )
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Encodes an access JWT.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = new JwtService()
    // Act.
    const token: string = jwt.encode(
      user.id.value,
      tokenType.ACCESS,
      new Date().getTime(),
    )
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Encodes an access JWT even when TTL is not defined.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = new JwtService()
    // Act.
    const token: string = jwt.encode(user.id.value, tokenType.ACCESS)
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Decodes an activation JWT.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenActivation()
    const jwt = new JwtService()
    // Act.
    const payload: Payload = jwt.decode(token)
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
    const jwt = new JwtService()
    // Act.
    const payload: Payload = jwt.decode(token)
    // Assert.
    expect(payload.id).toBeTruthy()
    expect(payload.type).toEqual(tokenType.ACCESS)
    expect(payload.iat).toBeTruthy()
    expect(payload.ttl).toBeTruthy()
  })

  test(`Fails to encode without JWT_SECRET.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const backupJwtSecret = process.env.RR_JWT_SECRET
    delete process.env.RR_JWT_SECRET
    const jwt = new JwtService()
    // Act and assert.
    expect(() => {
      jwt.encode(user.id.value, tokenType.ACCESS, new Date().getTime())
    }).toThrow(`JWT error. Secret key is not defined.`)
    process.env.RR_JWT_SECRET = backupJwtSecret
  })

  test(`Fails to encode without User ID.`, () => {
    // Arrange, act, and assert.
    const jwt = new JwtService()
    expect(() => {
      jwt.encode(``, tokenType.ACCESS, new Date().getTime())
    }).toThrow(`JWT error. User ID is not defined.`)
  })

  test(`Fails to encode without token type.`, async () => {
    // Arrange
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = new JwtService()
    // Act, and assert.
    expect(() => {
      jwt.encode(user.id.value, tokenType.NONE, new Date().getTime())
    }).toThrow(`JWT error. Type is not defined.`)
  })

  test(`Fails to decodes without JWT_SECRET.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenActivation()
    const backupJwtSecret = process.env.RR_JWT_SECRET
    delete process.env.RR_JWT_SECRET
    const jwt = new JwtService()
    // Act and assert.
    expect(() => {
      jwt.decode(token)
    }).toThrow(`JWT error. Secret key is not defined.`)
    process.env.RR_JWT_SECRET = backupJwtSecret
  })

  test(`Fails to decodes without token.`, () => {
    // Arrange, act, and assert.
    const jwt = new JwtService()
    expect(() => {
      jwt.decode(``)
    }).toThrow(`JWT error. Token is not defined.`)
  })
})
