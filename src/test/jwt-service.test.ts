/**
 * JwtService tests.
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

import { IJwtService, Payload, tokenType } from 'service/jwt-service'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

import { TestFactory } from 'test/test-factory'

describe(`JwtService tests.`, () => {
  test(`Encodes an activation token.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act.
    const token: string = jwt.encode(user.id.value, tokenType.ACTIVATION, new Date().getTime())
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Encodes an access token.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act.
    const token: string = jwt.encode(user.id.value, tokenType.ACCESS, new Date().getTime())
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Encodes an access token even when TTL is not defined.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act.
    const token: string = jwt.encode(user.id.value, tokenType.ACCESS)
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Decodes an activation token.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenActivation()
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act.
    const payload: Payload = jwt.decode(token)
    // Assert.
    expect(payload.id).toBeTruthy()
    expect(payload.type).toEqual(tokenType.ACTIVATION)
    expect(payload.iat).toBeTruthy()
    expect(payload.ttl).toBeTruthy()
  })

  test(`Decodes an access token.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenAccess()
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act.
    const payload: Payload = jwt.decode(token)
    // Assert.
    expect(payload.id).toBeTruthy()
    expect(payload.type).toEqual(tokenType.ACCESS)
    expect(payload.iat).toBeTruthy()
    expect(payload.ttl).toBeTruthy()
  })

  test(`Fails to encode a token without env var JWT_SECRET.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const backupJwtSecret = process.env.RR_JWT_SECRET
    delete process.env.RR_JWT_SECRET
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act and assert.
    expect(() => {
      jwt.encode(user.id.value, tokenType.ACCESS, new Date().getTime())
    }).toThrow(`JWT error. Secret key is not defined.`)
    process.env.RR_JWT_SECRET = backupJwtSecret
  })

  test(`Fails to encode a token without a iser id.`, () => {
    // Arrange, act, and assert.
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    expect(() => {
      jwt.encode(``, tokenType.ACCESS, new Date().getTime())
    }).toThrow(`JWT error. User ID is not defined.`)
  })

  test(`Fails to encode a token without a specified token type.`, async () => {
    // Arrange
    const testFactory: TestFactory = new TestFactory()
    const user: User = await testFactory.userNew()
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act, and assert.
    expect(() => {
      jwt.encode(user.id.value, tokenType.NONE, new Date().getTime())
    }).toThrow(`JWT error. Type is not defined.`)
  })

  test(`Fails to decode a token without env var JWT_SECRET.`, () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = testFactory.tokenActivation()
    const backupJwtSecret = process.env.RR_JWT_SECRET
    delete process.env.RR_JWT_SECRET
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    // Act and assert.
    expect(() => {
      jwt.decode(token)
    }).toThrow(`JWT error. Secret key is not defined.`)
    process.env.RR_JWT_SECRET = backupJwtSecret
  })

  test(`Fails to decodes without a token.`, () => {
    // Arrange, act, and assert.
    const jwt = container.get<IJwtService>(SYMBOLS.IJwtService)
    expect(() => {
      jwt.decode(``)
    }).toThrow(`JWT error. Token is not defined.`)
  })
})
