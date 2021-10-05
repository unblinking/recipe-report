/**
 * User service.
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

import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from '../db/models/service-requests'
import {
  UserActivationResponse,
  UserAuthenticationResponse,
  UserRegistrationResponse,
} from '../db/models/service-responses'
import { UserModel } from '../db/models/user-model'
import { UserFactory } from '../factories/user-factory'
import { UserRepo } from '../repositories/user-repo'
import { PostgreSQL } from '../db/index'
import { DomainConverter } from '../db/models/domainconverter'
import { decodeToken, encodeToken, Payload, tokenType } from '../wrappers/token'
import { EmailMessageService } from './email-message-service'
import { AuthenticationModel } from '../db/models/authentication-model'

export interface IUserService {
  register(
    userRegistrationRequest: UserRegistrationRequest
  ): Promise<UserRegistrationResponse<UserModel>>
}

export class UserService implements IUserService {
  public async register(
    req: UserRegistrationRequest
  ): Promise<UserRegistrationResponse<UserModel>> {
    const res = new UserRegistrationResponse<UserModel>()
    const db = await new PostgreSQL().getClient()
    const userRepo = new UserRepo(db)
    try {
      if (!req.item?.username) throw new Error(`Username is not defined.`)
      if (!req.item.email_address)
        throw new Error(`Email address is not defined.`)
      if (!req.item.password) throw new Error(`Password is not defined.`)

      // Verify that the username does not already exist in the db.
      const countByUsername = await userRepo.countByUsername(req.item?.username)
      if (countByUsername > 0) throw new Error(`Username is already in use.`)

      // Verify that the email address does not already exist in the db.
      const countByEmailAddress = await userRepo.countByEmailAddress(
        req.item.email_address
      )
      if (countByEmailAddress > 0)
        throw new Error(`Email address is already in use.`)

      // User factory creates an instance of a user.
      const userFactory = new UserFactory()
      const newUser = await userFactory.create({ ...req.item })

      // User repository saves user to the db.
      // Dehydrate the new user into a DTO for the repository.
      const userDehydrated = DomainConverter.toDto<UserModel>(newUser)
      const repoResult = await userRepo.createOne(userDehydrated)

      // Hydrate a user instance from the repository results.
      const userHydrated = DomainConverter.fromDto<UserModel>(
        UserModel,
        repoResult.rows[0]
      )

      // Create a JWT for the new user's activation email.
      // const tokenType: string = `activation`
      const ttl = new Date().getTime() + 24 * 60 * 60 * 1000
      const token = encodeToken(
        userHydrated.id as string,
        tokenType.ACTIVATION,
        ttl
      )

      // Email message service sends a registration email.
      const emailMessageService = new EmailMessageService()
      await emailMessageService.sendActivation(userHydrated, token)

      console.log(userHydrated)

      res.setItem(userHydrated)
      res.setSuccess(true)
    } catch (e) {
      res.setError(e as Error)
    }
    db.release()
    return res
  }

  public async activate(
    req: UserActivationRequest
  ): Promise<UserActivationResponse<UserModel>> {
    const res = new UserActivationResponse<UserModel>()
    const db = await new PostgreSQL().getClient()
    try {
      // Decode and decrypt the token.
      const encryptedEncodedToken = req.item?.token
      const payload: Payload = decodeToken(encryptedEncodedToken)

      // Verify that the token is for activation.
      if (payload.type !== tokenType.ACTIVATION)
        throw new Error(`Token type is not activation.`)

      // Verify that the token hasn't expired.
      const now = new Date().getTime()
      if (payload.ttl < now) throw new Error(`Token expired.`)

      // Find the user in the database
      const userRepo = new UserRepo(db)
      const findResult = await userRepo.findOneById(payload.id)

      // If user is not found, throw error.
      if (findResult.rowCount < 1) throw new Error(`User not found.`)

      // Hydrate a user instance from the repository results.
      const userHydrated = DomainConverter.fromDto<UserModel>(
        UserModel,
        findResult.rows[0]
      )

      // Verify that the user is not already activated.
      if (userHydrated.date_activated !== null)
        throw new Error(`User previously activated.`)

      // Set the user as activated
      userHydrated.setDateActivated(new Date())

      // Save the activated user.
      // Dehydrate the activated user into a DTO for the repository.
      const userDehydrated = DomainConverter.toDto<UserModel>(userHydrated)
      const updateResult = await userRepo.updateOneById(userDehydrated)
      const activatedUser = updateResult.rows[0]

      // Respond with success
      res.setItem(activatedUser)
      res.setSuccess(true)
    } catch (e) {
      res.setError(e as Error)
    }
    db.release()
    return res
  }

  public async authenticate(
    req: UserAuthenticationRequest
  ): Promise<UserAuthenticationResponse<AuthenticationModel>> {
    const res = new UserAuthenticationResponse<AuthenticationModel>()
    const db = await new PostgreSQL().getClient()
    const postgreSQL = new PostgreSQL()
    try {
      if (!req.item?.email_address)
        throw new Error(`Email address is not defined.`)
      if (!req.item.password) throw new Error(`Password is not defined.`)

      // Try to authenticate in the database.
      const queryResult = await postgreSQL.authenticate(req.item)

      // Error if authentication failed.
      if (queryResult.rowCount !== 1)
        throw new Error(`Unable to authenticate user.`)

      // Create a JWT for the user's access.
      const userId = queryResult.rows[0].id
      const ttl = new Date().getTime() + 24 * 60 * 60 * 1000
      const token = encodeToken(userId, tokenType.ACCESS, ttl)

      // Put the token into an authentication model.
      const auth = new AuthenticationModel({ token: token })

      res.setItem(auth)
      res.setSuccess(true)
    } catch (e) {
      res.setError(e as Error)
    }
    db.release()
    return res
  }
}
