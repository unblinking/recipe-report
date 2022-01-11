/**
 * Role service.
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

import { RoleMap } from 'domain/maps/role-map'
import { Err, errClient, isErrClient } from 'domain/models/err-model'
import { Role } from 'domain/models/role-model'
import { RoleRequest } from 'domain/service/service-requests'
import { RoleResponse } from 'domain/service/service-responses'

import { IUnitOfWork } from 'data/repositories/unit-of-work'

import { log } from 'service/log-service'

import { container } from 'root/ioc.config'
import { SYMBOLS } from 'root/symbols'

export interface IRoleService {
  create(req: RoleRequest): Promise<RoleResponse>
}

@injectable()
export class RoleService implements IRoleService {
  // public constructor() {}

  public async create(req: RoleRequest): Promise<RoleResponse> {
    log.trace(`role-service.ts create()`)

    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Create the user in persistence.
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
}
