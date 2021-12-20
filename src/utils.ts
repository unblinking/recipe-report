/**
 * Utilities.
 * Some handy utilities to use everywhere.
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
import { createLogger } from 'bs-logger'

import {
  errBaseValueType,
  errMessageKeyType,
  errMessageValueType,
} from './data/constants'

/**
 * What rolls down stairs, Alone or in pairs, And over your neightbor's dog?
 * What's great for a snack, And fits on your back? It's log, log, log.
 * It's log, log, log, It's big, it's heavy, it's wood.
 * It's log, it's log, It's better than bad, it's good.
 * Everyone wants a log. You're gonna log it, log.
 * Come on and get your log. Everyone needs a log.
 * Log log log. Log from blammo!
 *
 * A wrapper around bs-logger.
 * @see {@link https://github.com/huafu/bs-logger bs-logger}
 */
export const log = createLogger({
  targets: process.env.MY_LOG_TARGETS,
})

/**
 * Extended class based on the Error class.
 * Set a name and message all at once. Remarkable!
 *
 * Instantiate error objects with a custom name in one line, with type safety
 * enforced for the name and message. Error messages must be defined in the
 * global constants before they may be used.
 */
export class Err extends Error {
  constructor(
    name: errMessageKeyType | errBaseValueType,
    message: errMessageValueType,
  ) {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
