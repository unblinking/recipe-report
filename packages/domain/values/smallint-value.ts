/**
 * small integer value object.
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
import { Err, errClient } from '@recipe-report/domain/models'
import { ValueObject } from '@recipe-report/domain/values'

export interface ISmallInt {
  value: number
}

export class SmallInt extends ValueObject<ISmallInt> {
  public get value(): number {
    return this.props.value
  }

  private constructor(props: ISmallInt) {
    super(props)
  }

  public static create(smallInt: number): SmallInt {
    if (smallInt < -32768 || smallInt > 32767) {
      throw new Err(`SMALLINT_INVALID`, errClient.SMALLINT_INVALID)
    }
    return new SmallInt({ value: smallInt })
  }
}
