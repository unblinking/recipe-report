/**
 * Role mapper.
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
import { Err, errInternal } from 'domain/models/err-model'
import { IRole, IRoleDto, Role } from 'domain/models/role-model'
import { DisplayName } from 'domain/value/display-name-value'
import { SmallInt } from 'domain/value/smallint-value'
import { UniqueId } from 'domain/value/uid-value'

export class RoleMap {
  public static dtoToDomain(roleDto: IRoleDto): Role {
    if (!this.isRole(roleDto)) {
      throw new Err(`DOMAIN_OBJECT`, `RoleMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Role.create(
      {
        name: DisplayName.create(roleDto.name),
        description: roleDto.description,
        level: SmallInt.create(roleDto.level),
        date_created: roleDto.date_created ? new Date(roleDto.date_created) : undefined,
        date_deleted: roleDto.date_deleted ? new Date(roleDto.date_deleted) : undefined,
      },
      UniqueId.create(roleDto.id),
    )
  }

  public static dbToDomain(dbResult: IRoleDto, id: string): Role {
    if (!this.isRole(dbResult)) {
      throw new Err(`DOMAIN_OBJECT`, `RoleMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Role.create(
      {
        name: DisplayName.create(dbResult.name),
        description: dbResult.description,
        level: SmallInt.create(dbResult.level),
        date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
        date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
      },
      UniqueId.create(id),
    )
  }

  public static domainToDto(role: Role): IRoleDto {
    return {
      id: role.id.value,
      name: role.name.value,
      description: role.description,
      level: role.level.value,
      date_created: role.date_created?.toString(),
      date_deleted: role.date_deleted?.toString(),
    }
  }

  // Type-guard using a type-predicate method.
  public static isRole(raw: unknown): raw is IRole {
    if (!(raw as IRole).name) return false
    if (!(raw as IRole).description) return false
    if (!(raw as IRole).level) return false
    return true
  }
}
