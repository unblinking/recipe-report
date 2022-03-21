/**
 * User service.
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
import { container, SYMBOLS } from '@recipe-report/api/ioc'
import type { IUnitOfWork } from '@recipe-report/data/repositories'
import { UserMap } from '@recipe-report/domain/maps'
import { Account, Err, errClient, isErrClient, User } from '@recipe-report/domain/models'
import {
  StringRequest,
  UserRequest,
  UuidRequest,
  StringResponse,
  UserResponse,
} from '@recipe-report/domain/services'
import {
  DisplayName,
  EmailAddress,
  isStrongPassword,
  Password,
  PasswordResult,
  UniqueId,
} from '@recipe-report/domain/values'
import { IEmailService, Claims, IJwtService, tokenType } from '@recipe-report/service'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

export interface IUserService {
  create(req: UserRequest): Promise<UserResponse>
  read(req: UuidRequest): Promise<UserResponse>
  update(req: UserRequest): Promise<UserResponse>
  delete(req: UuidRequest): Promise<UserResponse>
  activate(req: StringRequest): Promise<UserResponse>
  authenticate(req: UserRequest): Promise<StringResponse>
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

  public async create(req: UserRequest): Promise<UserResponse> {
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

      // Create the entity in persistence.
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

      return UserResponse.success(UserMap.domainToDto(user))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.USER_CREATE} ${err.message}`
        return UserResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return UserResponse.error(err)
    }
  }

  public async read(req: UuidRequest): Promise<UserResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Read the entity from persistence.
      const user: User = await uow.users.read(req.id)

      // Read the accounts linked to the user entity.
      const accounts: Account[] = await uow.accounts.readAllByUser(req.id)
      user.setAccounts(accounts)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return UserResponse.success(UserMap.domainToDto(user))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.USER_READ} ${err.message}`
        return UserResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return UserResponse.error(err)
    }
  }

  public async update(req: UserRequest): Promise<UserResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has an id.
      if (!req.user.id) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} id`)
      }
      // Verify the request DTO has a name or email_address.
      // name and email_address are technically optional. Hopefully they're
      // updating at least one of those two though.
      if (!req.user.name && !req.user.email_address) {
        throw new Err(
          `MISSING_REQ`,
          `${errClient.MISSING_REQ} at least one of name or email_address`,
        )
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      const id = UniqueId.create(req.user.id)
      const name = req.user.name != undefined ? DisplayName.create(req.user.name) : undefined
      const email_address =
        req.user.email_address != undefined
          ? EmailAddress.create(req.user.email_address)
          : undefined

      // Update the entity in persistence.
      const user: User = await uow.users.update(id, name, email_address)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return UserResponse.success(UserMap.domainToDto(user))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.USER_UPDATE} ${err.message}`
        return UserResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return UserResponse.error(err)
    }
  }

  public async delete(req: UuidRequest): Promise<UserResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Delete the entity from persistence (soft delete).
      const user: User = await uow.users.delete(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return UserResponse.success(UserMap.domainToDto(user))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.USER_DELETE} ${err.message}`
        return UserResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return UserResponse.error(err)
    }
  }

  public async activate(req: StringRequest): Promise<UserResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Decode and decrypt the token.
      const payload: Claims = this._jwt.decode(req.item)
      // Verify that the token is for activation.
      if (payload.typ !== tokenType.ACTIVATION) {
        throw new Err(`TOKEN_TYPE`, errClient.TOKEN_TYPE)
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Activate the user.
      const user = await uow.users.activate(UniqueId.create(payload.sub))

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return UserResponse.success(UserMap.domainToDto(user))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.USER_ACTIVATE} ${err.message}`
        return UserResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return UserResponse.error(err)
    }
  }

  public async authenticate(req: UserRequest): Promise<StringResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has email_address and password.
      if (!req.user.email_address || !req.user.password) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} email_address, password`)
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      const email_address = EmailAddress.create(req.user.email_address)
      const password = Password.create(req.user.password)

      // Find the matching user in the database.
      const user = await uow.users.authenticate(email_address, password)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      // Create a JWT for the user's access.
      const token = this._jwt.encode(user.id.value, tokenType.ACCESS)

      return StringResponse.success(token)
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.USER_AUTHENTICATE} ${err.message}`
        return StringResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return StringResponse.error(err)
    }
  }
}
