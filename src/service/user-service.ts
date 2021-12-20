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
import { PostgreSQL } from '../data/data-access'
import { UserFactory } from '../data/factories/user-factory'
import { IUserRepo } from '../data/repositories/user-repo'

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
  private _userRepo: IUserRepo

  public constructor(
    @inject(TYPES.IEmailService) emailService: IEmailService,
    @inject(TYPES.IUserRepo) userRepo: IUserRepo,
  ) {
    this._emailService = emailService
    this._userRepo = userRepo
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

      // Get a client to use the database with the user repository.
      const db = await new PostgreSQL().getClient()
      const userRepo = new UserRepo(db)

      // Verify that the username does not already exist in the db.
      const countByUsername = await userRepo.countByUsername(req.item?.username)
      if (countByUsername > 0) {
        db.release() // Release the database now before we return.
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`REG_USRNAME_USED`, errMsg.REG_USRNAME_USED))
        res.setStatusCode(httpStatus.CONFLICT)
        return res
      }

      // Verify that the email address does not already exist in the db.
      const countByEmailAddress = await userRepo.countByEmailAddress(
        req.item.email_address,
      )
      if (countByEmailAddress > 0) {
        db.release() // Release the database now before we return.
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
        db.release() // Release the database now before we return.
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

      // Create the user now.
      let repoResult: QueryResult
      try {
        // User factory creates an instance of a user.
        const userFactory = new UserFactory()
        const newUser = await userFactory.create({ ...req.item })
        // Dehydrate the new user into a DTO for the repository.
        const userDehydrated = DomainConverter.toDto<UserModel>(newUser)
        // User repository saves user to the db.
        repoResult = await userRepo.createOne(userDehydrated)
      } catch (e) {
        db.release() // Release the database now before we return.
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
      db.release()

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

      // Get a client to use the database with the user repository.
      const db = await new PostgreSQL().getClient()
      const userRepo = new UserRepo(db)

      // Find the user in the database
      const findResult = await userRepo.readOne(payload.id)

      // If user is not found, throw error.
      if (findResult.rowCount < 1) {
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
        res.setOutcome(outcomes.SUCCESS)
        return res
      }

      // Set the user as activated
      userHydrated.setDateActivated(new Date())
      // Dehydrate the activated user into a DTO for the repository.
      const userDehydrated = DomainConverter.toDto<UserModel>(userHydrated)
      // Save the activated user.
      const updateResult = await userRepo.updateOne(userDehydrated)

      // Done using the database now.
      db.release()

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

      // Try to authenticate in the database.
      const postgreSQL = new PostgreSQL()
      const queryResult = await postgreSQL.authenticate(req.item)

      // Error if authentication failed.
      if (queryResult.rowCount !== 1) {
        res.setOutcome(outcomes.FAIL)
        res.setErr(new Err(`AUTH`, errBase.AUTH)) // Just the short message.
        res.setStatusCode(httpStatus.UNAUTHORIZED)
        return res
      }

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
