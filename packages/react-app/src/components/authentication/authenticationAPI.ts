/**
 * API functions to be used with createAsyncThunk in the authenticationSlice.
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
import type { ApiRequestAuthentication, ApiResponse } from '@recipe-report/domain/interfaces'

import { post } from '../../../../client-share/wrappers/fetch'

// Perform a user authentication.
export async function requestAuthentication(
  request: ApiRequestAuthentication,
): Promise<ApiResponse> {
  const path = process.env['REACT_APP_API_URI'] + `/v1/users/session`
  const response = await post<ApiRequestAuthentication, ApiResponse>(path, request)
  return response
}
