/**
 * JWT.
 *
 * Typescript helper functions for working with the JSON Web Token (JWT).
 * These are specific to the recipe.report JWT.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}
 *
 * Based on a blog post by Alexander Eckert, July 12, 2020.
 * @see {@link https://eckertalex.dev/blog/typescript-fetch-wrapper}
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/unblinking/recipe-report}
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
import type { Claims } from '@recipe-report/service/jwt-service'
import jwt_decode from 'jwt-decode'

export function parseJwt(token: string): Claims {
  const payload: Claims = jwt_decode(token)
  return payload
}
