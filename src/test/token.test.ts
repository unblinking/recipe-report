/**
 * Token tests.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { TestFactory } from './test-factory'
import { DomainConverter } from '../db/models/domainconverter'
import { IUserModel, UserModel } from '../db/models/user-model'
import { decodeToken, encodeToken, Payload, tokenType } from '../wrappers/token'

describe(`JSON Web Token actions.`, () => {
  test(`Encodes a JWT.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const user: UserModel = await testFactory.userNew()
    const userDto: IUserModel = DomainConverter.toDto<UserModel>(user)
    // Act.
    const token: string = encodeToken(
      userDto.id as string,
      tokenType.ACCESS,
      new Date().getTime()
    )
    // Assert.
    expect(token).toBeTruthy()
  })

  test(`Decodes a JWT.`, async () => {
    // Arrange.
    const testFactory: TestFactory = new TestFactory()
    const token: string = await testFactory.tokenActivation()
    // Act.
    const payload: Payload = decodeToken(token)
    // Assert.
    expect(payload.id).toBeTruthy()
  })
})
