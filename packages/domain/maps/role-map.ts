/**
 * Role mapper.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import type { RoleDto } from '@recipe-report/domain/dtos'
import type { IRole } from '@recipe-report/domain/interfaces'
import { Err, errInternal, Role } from '@recipe-report/domain/models'
import { DisplayName, SmallInt, UniqueId } from '@recipe-report/domain/values'

export class RoleMap {
  public static dtoToDomain(roleDto: RoleDto): Role {
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

  public static dbToDomain(dbResult: RoleDto, id: string): Role {
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

  public static domainToDto(role: Role): RoleDto {
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
