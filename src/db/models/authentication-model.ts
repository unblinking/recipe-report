/**
 * User authentication model.
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

/**
 * User authentication model interface.
 *
 * @export
 * @interface IAuthenticationModel
 */
export interface IAuthenticationModel {
  token?: string
}

/**
 * User authentication model concrete class.
 *
 * @export
 * @class AuthenticationModel
 * @implements {IAuthenticationModel}
 */
export class AuthenticationModel implements IAuthenticationModel {
  private state: IAuthenticationModel = {}

  constructor(props: IAuthenticationModel) {
    this.setToken(props.token)
  }

  public get token(): string | undefined {
    return this.state.token
  }
  public setToken(token: string | undefined): void {
    this.state.token = token
  }
}
