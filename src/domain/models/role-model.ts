/**
 * Role model.
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
import { DisplayName } from 'domain/value/display-name-value'
import { UniqueId } from 'domain/value/uid-value'

import { Model } from './base-model'

export interface IRoleDto {
  id?: string
  name?: string
  description?: string
  date_created?: string
}

export interface IRole {
  name: DisplayName
  description: string
  date_created?: Date
}

export class Role extends Model<IRole> {
  public get id(): UniqueId {
    return this._id
  }

  public get name(): DisplayName {
    return this._props.name
  }

  public get description(): string {
    return this._props.description
  }

  public get date_created(): Date | undefined {
    return this._props.date_created
  }

  private constructor(props: IRole, id?: UniqueId) {
    super(props, id)
  }

  public static create(props: IRole, id?: UniqueId): Role {
    return new Role(props, id)
  }
}
