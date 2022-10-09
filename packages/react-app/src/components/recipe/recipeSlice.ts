/**
 * Recipe slice.
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
import type { RecipeDto } from '@recipe-report/domain/dtos'
import type { ApiRequestRecipe, ApiResponseRecipe } from '@recipe-report/domain/interfaces'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { requestRecipe } from './recipeAPI'

export interface RecipeState {
  status: `Ready` | `Loading` | `Failed` | `Error` | `Success`
  message?: string
  code?: string | undefined
  recipe?: RecipeDto
}

const initialState: RecipeState = {
  status: `Loading`,
  message: `Requesting recipe details.`,
}

// The async thunk to load recipe details.
// @see {@link https://redux-toolkit.js.org/api/createAsyncThunk}
export const recipeAsync = createAsyncThunk(
  `recipes/requestRecipe`,
  async (request: ApiRequestRecipe) => {
    const response: ApiResponseRecipe = await requestRecipe(request)
    return response
  },
)

// The recipe slice.
// @see {@link https://redux-toolkit.js.org/api/createSlice}
export const recipeSlice = createSlice({
  name: `recipe`,
  initialState,
  reducers: {
    loadRecipe: (state) => {
      state.status = `Ready`
      state.message = `Ready to load the recipe details.`
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(recipeAsync.pending, (state) => {
        state.status = `Loading`
        state.message = `Please stand by.`
      })
      .addCase(recipeAsync.fulfilled, (state, action) => {
        switch (action.payload.status) {
          case `fail`:
            state.status = `Failed`
            state.message = `Recipe loading failure. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `error`:
            state.status = `Error`
            state.message = `Recipe loading error. ${action?.payload?.message}`
            state.code = `${action?.payload?.code}`
            break
          case `success`:
            state.status = `Success`
            state.message = `Recipe loading successful.`
            state.code = undefined
            state.recipe = action?.payload?.data?.recipe
            break
          default:
            state = initialState
            break
        }
      })
      .addCase(recipeAsync.rejected, (state, action) => {
        state.status = `Failed`
        state.message = `Recipe loading failure. ${action?.error?.message}`
      })
  },
})

export const { loadRecipe } = recipeSlice.actions

export const selectRecipeStatus = (state: RootState): string => state.recipe.status
export const selectRecipeMessage = (state: RootState): string | undefined => state.recipe.message
export const selectRecipeCode = (state: RootState): string | undefined => state.recipe.code
export const selectRecipeRecipe = (state: RootState): RecipeDto | undefined | null =>
  state.recipe.recipe

export default recipeSlice.reducer
