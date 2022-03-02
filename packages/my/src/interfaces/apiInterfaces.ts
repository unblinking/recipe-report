/**
 * API related interfaces.
 *
 * All API responses will be formatted in the same way. Each API request can be
 * completely unique.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/nothingworksright/my.recipe.report}
 *
 * Recipe.Report Web App is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report Web App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import { UserDto } from 'api.recipe.report/src/dto/user-dto'

// Universal API response interface.
// All responses from the Recipe.Report API Server will be in this format.
export interface ApiResponse {
  status: `success` | `fail` | `error`
  message?: string
  code?: string
  data?: Record<string, unknown>
}

export interface ApiResponseUser extends ApiResponse {
  data: Record<'user', UserDto>
}

export interface ApiRequestActivation {
  token: string
}

export interface ApiRequestAuthentication {
  email_address: string
  password: string
}

export interface ApiRequestProfile {
  id: string
  token: string
}

export interface ApiRequestRegistration {
  name: string
  email_address: string
  password: string
}
