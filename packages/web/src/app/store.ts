/**
 * Redux Toolkit's Store.
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
import { configureStore } from '@reduxjs/toolkit'
import type { Action, ThunkAction } from '@reduxjs/toolkit'

import activationReducer from '../components/activation/activationSlice'
import authenticationReducer from '../components/authentication/authenticationSlice'
import profileReducer from '../components/profile/profileSlice'
import registrationReducer from '../components/registration/registrationSlice'

/**
 * Redux Toolkit's store.
 * @see {@link https://redux-toolkit.js.org/usage/usage-with-typescript/#getting-the-state-type}
 */
export const store = configureStore({
  reducer: {
    activation: activationReducer,
    authentication: authenticationReducer,
    profile: profileReducer,
    registration: registrationReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
