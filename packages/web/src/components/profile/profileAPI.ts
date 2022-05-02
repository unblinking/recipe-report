/**
 * API functions to be used with createAsyncThunk in the profileSlice.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/nothingworksright/recipe-report}
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
import type { ApiRequestProfile, ApiResponseUser } from '@recipe-report/domain/interfaces'

import { get } from '../../wrappers/fetch'

export async function requestProfile(request: ApiRequestProfile): Promise<ApiResponseUser> {
  const path = process.env['REACT_APP_API_URI'] + `/v1/users/${request.id}`
  const response = await get<ApiResponseUser>(path, request.token)
  return response
}
