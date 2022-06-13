/**
 * UUID value object.
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
import { Err, errClient } from '@recipe-report/domain/models'
import { ValueObject } from '@recipe-report/domain/values'
import { v4 as uuid, validate } from 'uuid'

export interface IUniqueId {
  value: string
}

export class UniqueId extends ValueObject<IUniqueId> {
  public get value(): string {
    return this.props.value
  }

  private constructor(props: IUniqueId) {
    super(props)
  }

  public static create(id?: string): UniqueId {
    if (!id) {
      id = uuid()
    }
    if (!validate(id)) {
      throw new Err(`UID_INVALID`, errClient.UID_INVALID)
    }
    return new UniqueId({ value: id })
  }
}
