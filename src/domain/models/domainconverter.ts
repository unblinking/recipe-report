/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Domain converter.
 *
 * Create domain model instances from existing API data as well as convert
 * them back to plain data objects.
 *
 * Based on a blog post by Cory Rylan, October 5, 2018.
 * @see {@link https://coryrylan.com/blog/rich-domain-models-with-typescript Rich Domain Models with TypeScript}
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

export interface Type<T> extends Function {
  new (...args: any[]): T
}

export class DomainConverter {
  // Convert from simple JSON (data transfer object) to domain model instance.
  static fromDto<T>(domain: Type<T>, dto: any): T {
    const instance = Object.create(domain.prototype)
    instance._state = dto
    return instance as T
  }

  // Convert from domain model instance to simple JSON (data transfer object).
  static toDto<T>(domain: any): T {
    return domain._state as T
  }
}

/**
 * Example use
 *

const userDto: IUserModel = {
  username: `Joshua15`,
  password: encryptedPassword,
  email: `joshua15@unblinking.io`,
}

const userHydrated = DomainConverter.fromDto<UserModel>(
  UserModel,
  userDto
)
console.log(userHydrated)

const userDehydrated = DomainConverter.toDto<UserModel>(userHydrated)
console.log(userDehydrated)

*/
