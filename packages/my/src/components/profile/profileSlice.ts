/**
 * Profile slice.
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
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from 'app/store'

import { requestProfile } from 'components/profile/profileAPI'

import { ApiRequestProfile, ApiResponseUser } from 'interfaces/apiInterfaces'
import { IUserDto } from 'interfaces/userInterface'

export interface ProfileState {
  status: `Ready` | `Loading` | `Failed` | `Error` | `Success`
  message?: string
  code?: string
  user?: IUserDto
}

const initialState: ProfileState = {
  status: `Loading`,
  message: `Requesting user profile details.`,
  code: undefined,
  user: undefined,
}

// The async thunk to load user profile details.
// @see {@link https://redux-toolkit.js.org/api/createAsyncThunk}
export const profileAsync = createAsyncThunk(
  `users/requestProflie`,
  async (request: ApiRequestProfile) => {
    const response: ApiResponseUser = await requestProfile(request)
    return response
  },
)

// The profile slice.
// @see {@link https://redux-toolkit.js.org/api/createSlice}
export const profileSlice = createSlice({
  name: `profile`,
  initialState,
  reducers: {
    ready: (state) => {
      state.status = `Ready`
      state.message = `Ready to load the user profile details.`
      state.code = undefined
      state.user = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileAsync.pending, (state) => {
        state.status = `Loading`
        state.message = `Please stand by.`
        state.code = undefined
        state.user = undefined
      })
      .addCase(profileAsync.fulfilled, (state, action) => {
        switch (action.payload.status) {
          case `fail`:
            state.status = `Failed`
            state.message = `Profile loading failure. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `error`:
            state.status = `Error`
            state.message = `Profile loading error. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `success`:
            state.status = `Success`
            state.message = `Profile loading successful.`
            state.code = undefined
            state.user = action.payload.data.user
            break
          default:
            state = initialState
            break
        }
      })
      .addCase(profileAsync.rejected, (state, action) => {
        state.status = `Failed`
        state.message = `Profile loading failure. ${action?.error?.message}`
        state.code = undefined
      })
  },
})

export const { ready } = profileSlice.actions

export const selectStatus = (state: RootState): string => state.profile.status
export const selectMessage = (state: RootState): string | undefined => state.profile.message
export const selectCode = (state: RootState): string | undefined => state.profile.code
export const selectUser = (state: RootState): IUserDto | undefined | null => state.profile.user

export default profileSlice.reducer
