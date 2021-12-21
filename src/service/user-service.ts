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
 *
 * @module
 */
import { inject, injectable } from 'inversify'
import { QueryResult } from 'pg'

import { errBase, errMsg, httpStatus, outcomes } from '../data/constants'
import { UserFactory } from '../data/factories/user-factory'
import { IUnitOfWork } from '../data/repositories/unit-of-work'

import { AuthenticationModel } from '../domain/models/authentication-model'
import { DomainConverter } from '../domain/models/domainconverter'
import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from '../domain/models/service-requests'
import {
  UserActivationResponse,
  UserAuthenticationResponse,
  UserRegistrationResponse,
} from '../domain/models/service-responses'
import { UserModel } from '../domain/models/user-model'

import { Err } from '../utils'

import { container } from '../ioc.config'
import { TYPES } from '../types'
import { IEmailService } from './email-service'
import { JwtService, Payload, tokenType } from './jwt-service'
import { PasswordResult, PasswordService } from './password-service'

export interface IUserService {
  register(
    userRegistrationRequest: UserRegistrationRequest,
  ): Promise<UserRegistrationResponse<UserModel>>

  activate(
    req: UserActivationRequest,
  ): Promise<UserActivationResponse<UserModel>>

  authenticate(
    req: UserAuthenticationRequest,
  ): Promise<UserAuthenticationResponse<AuthenticationModel>>
}

@injectable()
export class UserService implements IUserService {
  private _emailService: IEmailService

  public constructor(@inject(TYPES.IEmailService) emailService: IEmailService) {
    this._emailService = emailService
  }

  /**
   * Register/create a new user in the system.
   * @param req The new user registration request.
   * @returns The new user registration response including the user model.
   */
  public async register(
    req: UserRegistrationRequest,
  ): Promise<UserRegistrationResponse<UserModel>> {
    const res = new UserRegistrationResponse<UserModel>()

    try {
      // Verify that the required arguments were passed as expected.
      if (!req.item?.username) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`REG_USRNAME_UNDEF`, errMsg.REG_USRNAME_UNDEF))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }
      if (!req.item.email_address) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`REG_EMAIL_UNDEF`, errMsg.REG_EMAIL_UNDEF))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }
      if (!req.item.password) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`REG_PASS_UNDEF`, errMsg.REG_PASS_UNDEF))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Use the database.
      // Get a new instance of uow from the DI container.
      const uow = container.get<IUnitOfWork>(TYPES.IUnitOfWork)
      await uow.connect()
      await uow.begin()

      // Verify that the username does not already exist in the db.
      const countByUsername = await uow.users.countByUsername(
        req.item?.username,
      )
      if (countByUsername > 0) {
        await uow.rollback()
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`REG_USRNAME_USED`, errMsg.REG_USRNAME_USED))
        res.setStatusCode(httpStatus.CONFLICT)
        return res
      }

      // Verify that the email address does not already exist in the db.
      const countByEmailAddress = await uow.users.countByEmailAddress(
        req.item.email_address,
      )
      if (countByEmailAddress > 0) {
        await uow.rollback()
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`REG_EMAIL_USED`, errMsg.REG_EMAIL_USED))
        res.setStatusCode(httpStatus.CONFLICT)
        return res
      }

      // Verify that the password is strong.
      const password = new PasswordService()
      const passwordResult: PasswordResult = await password.confirmStrength(
        req.item.password,
        req.item.email_address,
        req.item.username,
      )
      if (!passwordResult.success) {
        await uow.rollback()
        res.setOutcome(outcomes.FAIL)
        res.setErr(
          new Err(
            `REG_PASS_WEAK`,
            `${errMsg.REG_PASS_WEAK} ${passwordResult.message}`,
          ),
        )
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Hash the provided plaintext password.
      const plainText = req.item.password
      const hashAndSaltResult = await uow.users.hashAndSalt(plainText)
      if (hashAndSaltResult.rowCount < 1 || !hashAndSaltResult.rows[0].crypt)
        throw new Err(`REG_USR_HASH`, errMsg.REG_USR_HASH)
      const hashed = hashAndSaltResult.rows[0].crypt

      // Set the hashed password in the properties we will use to
      // create the user object instance.
      req.item.password = hashed

      // Create the user now.
      let repoResult: QueryResult
      try {
        // User factory creates an instance of a user.
        const userFactory = new UserFactory()
        const newUser = await userFactory.create({ ...req.item })
        // Dehydrate the new user into a DTO for the repository.
        const userDehydrated = DomainConverter.toDto<UserModel>(newUser)
        // User repository saves user to the db.
        repoResult = await uow.users.createOne(userDehydrated)
      } catch (e) {
        await uow.rollback()
        const err = e as Err
        switch (err.name) {
          case `USR_EMAIL_UNDEF`:
            // This is a client error. We will provide the client with feedback.
            res.setOutcome(outcomes.FAIL)
            res.setErr(err)
            res.setStatusCode(httpStatus.BAD_REQUEST)
            break
          case `USR_EMAIL_INVALID`:
            // This is a client error. We will provide the client with feedback.
            res.setOutcome(outcomes.FAIL)
            res.setErr(err)
            res.setStatusCode(httpStatus.BAD_REQUEST)
            break
          default:
            // This is an unknown error. Don't leak details externally.
            res.setOutcome(outcomes.ERROR)
            res.setErr(err)
            res.setStatusCode(httpStatus.INTERNAL_ERROR)
            break
        }
        return res
      }

      // Done using the database now.
      await uow.commit()

      // Hydrate a user instance from the repository results.
      const userHydrated = DomainConverter.fromDto<UserModel>(
        UserModel,
        repoResult.rows[0],
      )

      // Create a JWT for the new user's activation email.
      const jwt = new JwtService(process.env.JWT_SECRET)
      const token = jwt.encode(
        userHydrated.id as string,
        tokenType.ACTIVATION,
        new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours.
      )

      // Email message service sends a registration email.
      await this._emailService.sendActivation(userHydrated, token)

      res.setItem(userHydrated)
      res.setOutcome(outcomes.SUCCESS)
    } catch (e) {
      res.setOutcome(outcomes.ERROR)
      res.setErr(e as Err)
      res.setStatusCode(httpStatus.INTERNAL_ERROR)
      return res
    }

    return res
  }

  /**
   * Activate a user in the system.
   * @param req The user activation request.
   * @returns The user activation response including the user model.
   */
  public async activate(
    req: UserActivationRequest,
  ): Promise<UserActivationResponse<UserModel>> {
    const res = new UserActivationResponse<UserModel>()

    try {
      // Verify that the required arguments were passed as expected.
      if (!req.item?.token) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`ACTIV_TOKEN_UNDEF`, errMsg.ACTIV_TOKEN_UNDEF))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Decode and decrypt the token.
      let payload: Payload
      try {
        const jwt = new JwtService(process.env.JWT_SECRET)
        payload = jwt.decode(req.item?.token)
      } catch {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`ACTIV_TOKEN_DECODE`, errMsg.ACTIV_TOKEN_DECODE))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Verify that the token is for activation.
      if (payload.type !== tokenType.ACTIVATION) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`ACTIV_TOKEN_TYPE`, errMsg.ACTIV_TOKEN_TYPE))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Verify that the token hasn't expired.
      const now = new Date().getTime()
      if (payload.ttl < now) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`ACTIV_TOKEN_EXP`, errMsg.ACTIV_TOKEN_EXP))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Use the database.
      // Get a new instance of uow from the DI container.
      const uow = container.get<IUnitOfWork>(TYPES.IUnitOfWork)
      await uow.connect()
      await uow.begin()

      // Find the user in the database
      const findResult = await uow.users.readOne(payload.id)

      // If user is not found, throw error.
      if (findResult.rowCount < 1) {
        await uow.rollback()
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`ACTIV_TOKEN_USR`, errMsg.ACTIV_TOKEN_USR))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Hydrate a user instance from the repository results.
      const userHydrated = DomainConverter.fromDto<UserModel>(
        UserModel,
        findResult.rows[0],
      )

      // Verify that the user is not already activated.
      if (userHydrated.date_activated !== null) {
        // If they are already activated, just return a success message now.
        await uow.rollback()
        res.setOutcome(outcomes.SUCCESS)
        return res
      }

      // Set the user as activated
      userHydrated.setDateActivated(new Date())
      // Dehydrate the activated user into a DTO for the repository.
      const userDehydrated = DomainConverter.toDto<UserModel>(userHydrated)
      // Save the activated user.
      const updateResult = await uow.users.updateOne(userDehydrated)

      // Done using the database now.
      await uow.commit()

      // Hydrate the user instance from the repository results, again.
      const userActivatedHydrated = DomainConverter.fromDto<UserModel>(
        UserModel,
        updateResult.rows[0],
      )

      res.setItem(userActivatedHydrated)
      res.setOutcome(outcomes.SUCCESS)
    } catch (e) {
      res.setOutcome(outcomes.ERROR)
      res.setErr(e as Err)
      res.setStatusCode(httpStatus.INTERNAL_ERROR)
      return res
    }

    return res
  }

  /**
   * Authenticate a user's credentials.
   * @param req The user authentication request.
   * @returns The user authentication response including the authentication model, containing the authentication token.
   */
  public async authenticate(
    req: UserAuthenticationRequest,
  ): Promise<UserAuthenticationResponse<AuthenticationModel>> {
    const res = new UserAuthenticationResponse<AuthenticationModel>()

    try {
      // Verify that the required arguments were passed as expected.
      if (!req.item?.email_address) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`AUTH_EMAIL_UNDEF`, errMsg.AUTH_EMAIL_UNDEF))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }
      if (!req.item.password) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`AUTH_PASS_UNDEF`, errMsg.AUTH_PASS_UNDEF))
        res.setStatusCode(httpStatus.BAD_REQUEST)
        return res
      }

      // Use the database.
      // Get a new instance of uow from the DI container.
      const uow = container.get<IUnitOfWork>(TYPES.IUnitOfWork)
      await uow.connect()
      await uow.begin()

      // Try to authenticate in the database.
      const queryResult = await uow.users.authenticate(req.item)

      // Error if authentication failed.
      if (queryResult.rowCount !== 1) {
        await uow.rollback()
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`AUTH`, errBase.AUTH)) // Just the short message.
        res.setStatusCode(httpStatus.UNAUTHORIZED)
        return res
      }

      // TODO: Update the user's last login date in the database.

      // Done using the database now.
      await uow.commit()

      // Create a JWT for the user's access.
      const userId = queryResult.rows[0].id
      const ttl = new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours.
      const jwt = new JwtService(process.env.JWT_SECRET)
      const token = jwt.encode(userId, tokenType.ACCESS, ttl)

      // Put the token into an authentication model.
      const auth = new AuthenticationModel({ token: token })

      res.setItem(auth)
      res.setOutcome(outcomes.SUCCESS)
    } catch (e) {
      res.setOutcome(outcomes.ERROR)
      res.setErr(e as Err)
      res.setStatusCode(httpStatus.INTERNAL_ERROR)
      return res
    }

    return res
  }
}
