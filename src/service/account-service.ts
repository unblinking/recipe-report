/**
 * Account service.
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
import { injectable } from 'inversify'

import { AccountMap } from 'domain/maps/account-map'
import { Account } from 'domain/models/account-model'
import { Err, errClient, isErrClient } from 'domain/models/err-model'
import { AccountRequest, UuidRequest } from 'domain/service/service-requests'
import { AccountResponse } from 'domain/service/service-responses'
import { DisplayName } from 'domain/value/display-name-value'
import { UniqueId } from 'domain/value/uid-value'

import { IUnitOfWork } from 'data/repositories/unit-of-work'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

export interface IAccountService {
  create(req: AccountRequest): Promise<AccountResponse>
  read(req: UuidRequest): Promise<AccountResponse>
  update(req: AccountRequest): Promise<AccountResponse>
  delete(req: UuidRequest): Promise<AccountResponse>
}

@injectable()
export class AccountService implements IAccountService {
  // public constructor() {}

  public async create(req: AccountRequest): Promise<AccountResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Create the entity in persistence.
      const account: Account = await uow.accounts.create(AccountMap.dtoToDomain(req.account))

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return AccountResponse.success(AccountMap.domainToDto(account))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ACCOUNT_CREATE} ${err.message}`
        return AccountResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return AccountResponse.error(err)
    }
  }

  public async read(req: UuidRequest): Promise<AccountResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Read the entity from persistence.
      const account: Account = await uow.accounts.read(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return AccountResponse.success(AccountMap.domainToDto(account))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ACCOUNT_READ} ${err.message}`
        return AccountResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return AccountResponse.error(err)
    }
  }

  public async update(req: AccountRequest): Promise<AccountResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has an id.
      if (!req.account.id) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} id`)
      }
      // Verify the request DTO has at least one other property that is being updated.
      if (
        !req.account.name &&
        !req.account.description &&
        !req.account.contact_user_id &&
        !req.account.location_code &&
        !req.account.time_zone &&
        !req.account.address_country &&
        !req.account.address_locality &&
        !req.account.address_region &&
        !req.account.address_post_office_box &&
        !req.account.address_postal_code &&
        !req.account.address_street
      ) {
        throw new Err(
          `MISSING_REQ`,
          `${errClient.MISSING_REQ} at least one of name, description, contact_user_id, location_code, time_zone, address_country, address_locality, address_region, address_post_office_box, address_postal_code, or address_street.`,
        )
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      const id = UniqueId.create(req.account.id)
      const name = req.account.name != undefined ? DisplayName.create(req.account.name) : undefined
      const description = req.account.description != undefined ? req.account.description : undefined
      const contact_user_id =
        req.account.contact_user_id != undefined
          ? UniqueId.create(req.account.contact_user_id)
          : undefined
      const location_code =
        req.account.location_code != undefined ? req.account.location_code : undefined
      const time_zone = req.account.time_zone != undefined ? req.account.time_zone : undefined
      const address_country =
        req.account.address_country != undefined ? req.account.address_country : undefined
      const address_locality =
        req.account.address_locality != undefined ? req.account.address_locality : undefined
      const address_region =
        req.account.address_region != undefined ? req.account.address_region : undefined
      const address_post_office_box =
        req.account.address_post_office_box != undefined
          ? req.account.address_post_office_box
          : undefined
      const address_postal_code =
        req.account.address_postal_code != undefined ? req.account.address_postal_code : undefined
      const address_street =
        req.account.address_street != undefined ? req.account.address_street : undefined

      // Update the entity in persistence.
      const account: Account = await uow.accounts.update(
        id,
        name,
        description,
        contact_user_id,
        location_code,
        time_zone,
        address_country,
        address_locality,
        address_region,
        address_post_office_box,
        address_postal_code,
        address_street,
      )

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return AccountResponse.success(AccountMap.domainToDto(account))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ACCOUNT_UPDATE} ${err.message}`
        return AccountResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return AccountResponse.error(err)
    }
  }

  public async delete(req: UuidRequest): Promise<AccountResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Delete the entity from persistence (soft delete).
      const account: Account = await uow.accounts.delete(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return AccountResponse.success(AccountMap.domainToDto(account))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ACCOUNT_DELETE} ${err.message}`
        return AccountResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return AccountResponse.error(err)
    }
  }
}
