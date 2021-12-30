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

import { UserMap } from 'domain/maps/user-map'
import { Err, errClient, errUser, isErrClient } from 'domain/models/err-model'
import { User } from 'domain/models/user-model'
import {
  UserActivationRequest,
  UserAuthenticationRequest,
  UserRegistrationRequest,
} from 'domain/service/service-requests'
import {
  UserActivationResponse,
  UserAuthenticationResponse,
  UserRegistrationResponse,
} from 'domain/service/service-responses'
import { isStrongPassword, PasswordResult } from 'domain/value/password-value'
import { UniqueId } from 'domain/value/uid-value'

import { httpStatus, outcomes } from 'data/constants'
import { IUnitOfWork } from 'data/repositories/unit-of-work'

import { IEmailService } from 'service/email-service'
import { IJwtService, Payload, tokenType } from 'service/jwt-service'
import { log } from 'service/log-service'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

export interface IUserService {
  create(req: UserRegistrationRequest): Promise<UserRegistrationResponse>
  activate(req: UserActivationRequest): Promise<UserActivationResponse>
  authenticate(req: UserAuthenticationRequest): Promise<UserAuthenticationResponse>
}

@injectable()
export class UserService implements IUserService {
  private _mail: IEmailService
  private _jwt: IJwtService

  public constructor(
    @inject(SYMBOLS.IJwtService) jwtService: IJwtService,
    @inject(SYMBOLS.IEmailService) emailService: IEmailService,
  ) {
    this._mail = emailService
    this._jwt = jwtService
  }

  public async create(req: UserRegistrationRequest): Promise<UserRegistrationResponse> {
    log.trace(`user-service.ts register()`)

    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify sufficient password strength.
      // We pass the username and email address, so that they can be considered
      // while determining the password strength.
      const strength: PasswordResult = await isStrongPassword(
        req.user.password,
        req.user.name,
        req.user.email_address,
      )
      if (!strength.success) {
        throw new Err(`PASSWORD_WEAK`, `${errClient.PASSWORD_WEAK} ${strength.message}`)
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Create the user in persistence.
      const user: User = await uow.users.create(UserMap.dtoToDomain(req.user))

      // Create a JWT for the new user's activation email.
      const token = this._jwt.encode(
        user.id.value,
        tokenType.ACTIVATION,
        new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours.
      )

      // Email message service sends a registration email.
      await this._mail.sendActivation(user.email_address, token)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return new UserRegistrationResponse(
        outcomes.SUCCESS,
        undefined, // No error to return.
        UserMap.domainToDto(user),
        httpStatus.OK,
      )
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errUser.REGISTER} ${err.message}`
        return new UserRegistrationResponse(
          outcomes.FAIL,
          err,
          undefined, // No item to return.
          httpStatus.BAD_REQUEST,
        )
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return new UserRegistrationResponse(
        outcomes.ERROR,
        err,
        undefined, // No item to return.
        httpStatus.INTERNAL_ERROR,
      )
    }
  }

  public async activate(req: UserActivationRequest): Promise<UserActivationResponse> {
    log.trace(`user-service.ts activate()`)

    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has the required token.
      if (!req.token) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} token`)
      }

      // Decode and decrypt the token.
      const payload: Payload = this._jwt.decode(req.token)
      // Verify that the token is for activation.
      if (payload.type !== tokenType.ACTIVATION) {
        throw new Err(`TOKEN_TYPE`, errClient.TOKEN_TYPE)
      }
      // Verify that the token hasn't expired.
      const now = new Date().getTime()
      if (payload.ttl < now) {
        throw new Err(`TOKEN_EXP`, errClient.TOKEN_EXP)
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Activate the user.
      const user = await uow.users.activate(UniqueId.create(payload.id))

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return new UserActivationResponse(
        outcomes.SUCCESS,
        undefined, // No error to return.
        UserMap.domainToDto(user),
        httpStatus.OK,
      )
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errUser.REGISTER} ${err.message}`
        return new UserActivationResponse(
          outcomes.FAIL,
          err,
          undefined, // No item to return.
          httpStatus.BAD_REQUEST,
        )
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return new UserActivationResponse(
        outcomes.ERROR,
        err,
        undefined, // No item to return.
        httpStatus.INTERNAL_ERROR,
      )
    }
  }

  public async authenticate(req: UserAuthenticationRequest): Promise<UserAuthenticationResponse> {
    log.trace(`user-service.ts authenticate()`)

    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has required fields.
      if (!req.user.email_address || !req.user.password) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} email_address, password`)
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Set a placeholder name. We can't create the domain user without a name,
      // but the user repo authenticate method will not read the name.
      req.user.name = 'authenticate'

      // Find the matching user in the database.
      const user = await uow.users.authenticate(UserMap.dtoToDomain(req.user))

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      // Create a JWT for the user's access.
      const token = this._jwt.encode(
        user.id.value,
        tokenType.ACCESS,
        new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours.
      )

      return new UserAuthenticationResponse(
        outcomes.SUCCESS,
        undefined, // No error to return.
        token,
        httpStatus.OK,
      )
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errUser.REGISTER} ${err.message}`
        return new UserAuthenticationResponse(
          outcomes.FAIL,
          err,
          undefined, // No item to return.
          httpStatus.BAD_REQUEST,
        )
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return new UserAuthenticationResponse(
        outcomes.ERROR,
        err,
        undefined, // No item to return.
        httpStatus.INTERNAL_ERROR,
      )
    }
  }
}
