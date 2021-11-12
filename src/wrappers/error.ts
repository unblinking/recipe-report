/**
 * A wrapper around the Error class.
 *
 * Instantiate error objects with a custom name in one line, with type safety
 * enforced for the name and message. Error messages must be defined in the
 * global constants before they may be used.
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

import {
  errBaseValueType,
  errMessageKeyType,
  errMessageValueType,
} from '../constants'

/**
 * Extended class based on the Error class.
 * Set a name and message all at once. Remarkable!
 */
export class Err extends Error {
  constructor(
    name: errMessageKeyType | errBaseValueType,
    message: errMessageValueType
  ) {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
