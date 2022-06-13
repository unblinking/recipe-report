/**
 * Registration slice.
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
import type { ApiRequestRegistration, ApiResponse } from '@recipe-report/domain/interfaces'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { requestRegistration } from './registrationAPI'

export interface RegistrationState {
  status: `Ready` | `Loading` | `Failed` | `Error` | `Registered`
  message?: string
  code?: string
}

const initialState: RegistrationState = {
  status: `Ready`,
  message: `Please register.`,
}

// The async thunk to register a user.
// @see {@link https://redux-toolkit.js.org/api/createAsyncThunk}
export const registerAsync = createAsyncThunk(
  `users/requestRegistration`,
  async (request: ApiRequestRegistration) => {
    const response: ApiResponse = await requestRegistration(request)
    return response
  },
)

// The registration slice.
// @see {@link https://redux-toolkit.js.org/api/createSlice}
export const registrationSlice = createSlice({
  name: `registration`,
  initialState,
  reducers: {
    register: (state) => {
      state.status = `Ready`
      state.message = `Please register.`
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.status = `Loading`
        state.message = `Registering.`
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        switch (action.payload.status) {
          case `fail`:
            state.status = `Failed`
            state.message = `Registration failure. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `error`:
            state.status = `Error`
            state.message = `Registration error. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `success`:
            state.status = `Registered`
            state.message = `Registration successful. Please follow the new user activation link that was just sent to your email address, and then sign in.`
            break
          default:
            state = initialState
            break
        }
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.status = `Failed`
        state.message = `Registration failure. ${action?.error?.message}`
      })
  },
})

export const { register } = registrationSlice.actions

export const selectRegistrationStatus = (state: RootState): string => state.registration.status
export const selectRegistrationMessage = (state: RootState): string | undefined =>
  state.registration.message
export const selectRegistrationCode = (state: RootState): string | undefined =>
  state.registration.code

export default registrationSlice.reducer
