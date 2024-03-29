/**
 * Activation slice.
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
import type { ApiRequestActivation, ApiResponse } from '@recipe-report/domain/interfaces'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { requestActivation } from './activationAPI'

export interface ActivationState {
  status: `Ready` | `Loading` | `Failed` | `Error` | `Activated`
  message?: string
  code?: string | undefined
}

const initialState: ActivationState = {
  status: `Ready`,
  message: `Please follow the activation link from the email you received.`,
}

// The async thunk to activate a user.
// @see {@link https://redux-toolkit.js.org/api/createAsyncThunk}
export const activateAsync = createAsyncThunk(
  `users/requestActivation`,
  async (request: ApiRequestActivation) => {
    const response: ApiResponse = await requestActivation(request)
    return response
  },
)

// The activation slice.
// @see {@link https://redux-toolkit.js.org/api/createSlice}
export const activationSlice = createSlice({
  name: `activation`,
  initialState,
  reducers: {
    activate: (state) => {
      state.status = `Ready`
      state.message = `Please follow the activation link from the email you received.`
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(activateAsync.pending, (state) => {
        state.status = `Loading`
        state.message = `Activating.`
      })
      .addCase(activateAsync.fulfilled, (state, action) => {
        switch (action.payload.status) {
          case `fail`:
            state.status = `Failed`
            state.message = `Activation failure. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `error`:
            state.status = `Error`
            state.message = `Activation error. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `success`:
            state.status = `Activated`
            state.message = `Activation successful. Please sign in.`
            state.code = undefined
            break
          default:
            state = initialState
            break
        }
      })
      .addCase(activateAsync.rejected, (state, action) => {
        state.status = `Failed`
        state.message = `Activation failure. ${action?.error?.message}`
      })
  },
})

export const { activate } = activationSlice.actions

export const selectActivationStatus = (state: RootState): string => state.activation.status
export const selectActivationMessage = (state: RootState): string | undefined =>
  state.activation.message
export const selectActivationCode = (state: RootState): string | undefined => state.activation.code

export default activationSlice.reducer
