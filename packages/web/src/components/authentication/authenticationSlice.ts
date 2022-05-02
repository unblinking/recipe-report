/**
 * Authentication slice.
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
import type { ApiRequestAuthentication, ApiResponse } from '@recipe-report/domain/interfaces'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { requestAuthentication } from '../../components/authentication/authenticationAPI'

export interface AuthenticationState {
  status: `Required` | `Loading` | `Failed` | `Error` | `Authenticated`
  message?: string
  code?: string
  token?: string | null
}

const initialState: AuthenticationState = {
  status: `Required`,
  message: `Please sign in.`,
  token: sessionStorage.getItem('token'),
}

// The async thunk to authenticate a user.
// @see {@link https://redux-toolkit.js.org/api/createAsyncThunk}
export const authenticateAsync = createAsyncThunk(
  `users/requestAuthentication`,
  async (request: ApiRequestAuthentication) => {
    const response: ApiResponse = await requestAuthentication(request)
    return response
  },
)

// The authentication slice.
// @see {@link https://redux-toolkit.js.org/api/createSlice}
export const authenticationSlice = createSlice({
  name: `authentication`,
  initialState,
  reducers: {
    logout: (state) => {
      state.status = `Required`
      state.message = `You have signed out.`
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateAsync.pending, (state) => {
        state.status = `Loading`
        state.message = `Authenticating.`
      })
      .addCase(authenticateAsync.fulfilled, (state, action) => {
        switch (action.payload.status) {
          case `fail`:
            state.status = `Failed`
            state.message = `Authentication failure. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `error`:
            state.status = `Error`
            state.message = `Authentication error. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `success`:
            if (action?.payload?.data?.['token']) {
              state.status = `Authenticated`
              state.message = `Authentication successful.`
              state.token = String(action?.payload.data['token'])
              sessionStorage.setItem('token', String(action.payload.data['token']))
            } else {
              // Somehow we got status of success but no token.
              state.status = `Failed`
              state.message = `Authentication failure. No token received. ${action?.payload?.message}`
            }
            break
          default:
            state = initialState
            break
        }
      })
      .addCase(authenticateAsync.rejected, (state, action) => {
        state.status = `Failed`
        state.message = `Authentication failure. ${action?.error?.message}`
      })
  },
})

export const { logout } = authenticationSlice.actions

export const selectAuthenticationStatus = (state: RootState): string => state.authentication.status
export const selectAuthenticationMessage = (state: RootState): string | undefined =>
  state.authentication.message
export const selectAuthenticationCode = (state: RootState): string | undefined =>
  state.authentication.code
export const selectAuthenticationToken = (state: RootState): string | undefined | null =>
  state.authentication.token

export default authenticationSlice.reducer
