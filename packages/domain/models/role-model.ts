/**
 * Role model.
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
import type { IRole } from '@recipe-report/domain/interfaces'
import { Model } from '@recipe-report/domain/models'
import type { DisplayName, SmallInt, UniqueId } from '@recipe-report/domain/values'

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

  public get level(): SmallInt {
    return this._props.level
  }

  public get date_created(): Date | undefined {
    return this._props.date_created
  }

  public get date_deleted(): Date | undefined {
    return this._props.date_deleted
  }

  private constructor(props: IRole, id?: UniqueId) {
    super(props, id)
  }

  public static create(props: IRole, id?: UniqueId): Role {
    return new Role(props, id)
  }
}
