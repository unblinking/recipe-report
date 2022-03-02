/**
 * Role service.
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
import { injectable } from 'inversify'

import { IUnitOfWork } from 'data/repositories/unit-of-work'

import { RoleMap } from 'domain/maps/role-map'
import { Err, errClient, isErrClient } from 'domain/models/err-model'
import { Role } from 'domain/models/role-model'
import { RoleRequest, UuidRequest } from 'domain/service/service-requests'
import { RoleResponse } from 'domain/service/service-responses'
import { DisplayName } from 'domain/value/display-name-value'
import { SmallInt } from 'domain/value/smallint-value'
import { UniqueId } from 'domain/value/uid-value'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

export interface IRoleService {
  create(req: RoleRequest): Promise<RoleResponse>
  read(req: UuidRequest): Promise<RoleResponse>
  update(req: RoleRequest): Promise<RoleResponse>
  delete(req: UuidRequest): Promise<RoleResponse>
}

@injectable()
export class RoleService implements IRoleService {
  // public constructor() {}

  public async create(req: RoleRequest): Promise<RoleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Create the entity in persistence.
      const role: Role = await uow.roles.create(RoleMap.dtoToDomain(req.role))

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return RoleResponse.success(RoleMap.domainToDto(role))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ROLE_CREATE} ${err.message}`
        return RoleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return RoleResponse.error(err)
    }
  }

  public async read(req: UuidRequest): Promise<RoleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Read the entity from persistence.
      const role: Role = await uow.roles.read(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return RoleResponse.success(RoleMap.domainToDto(role))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ROLE_READ} ${err.message}`
        return RoleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return RoleResponse.error(err)
    }
  }

  public async update(req: RoleRequest): Promise<RoleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has an id.
      if (!req.role.id) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} id`)
      }
      // Verify the request DTO has a name or description or level.
      // Each property is options, but hopefully they're updating at least one
      // of those.
      if (!req.role.name && !req.role.description && !req.role.level) {
        throw new Err(
          `MISSING_REQ`,
          `${errClient.MISSING_REQ} at least one of name, description, or level`,
        )
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      const id = UniqueId.create(req.role.id)
      const name = req.role.name != undefined ? DisplayName.create(req.role.name) : undefined
      const description = req.role.description != undefined ? req.role.description : undefined
      const level = req.role.level != undefined ? SmallInt.create(req.role.level) : undefined

      // Update the entity in persistence.
      const role: Role = await uow.roles.update(id, name, description, level)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return RoleResponse.success(RoleMap.domainToDto(role))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ROLE_UPDATE} ${err.message}`
        return RoleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return RoleResponse.error(err)
    }
  }

  public async delete(req: UuidRequest): Promise<RoleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Delete the entity from persistence (soft delete).
      const role: Role = await uow.roles.delete(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return RoleResponse.success(RoleMap.domainToDto(role))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.ROLE_DELETE} ${err.message}`
        return RoleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return RoleResponse.error(err)
    }
  }
}
