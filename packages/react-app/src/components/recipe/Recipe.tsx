/**
 * Recipe component.
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
import type { ApiRequestRecipe } from '@recipe-report/domain/interfaces'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import styles from '../../components/recipe/Recipe.module.css'
import { selectAuthenticationToken } from '../authentication/authenticationSlice'
import { recipeAsync, selectRecipeRecipe } from './recipeSlice'

export function Recipe(): JSX.Element {
  const token = useAppSelector(selectAuthenticationToken)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (token) {
      const apiRequestRecipe: ApiRequestRecipe = {
        id: `d2477ba6-d3b2-4827-90f4-7a427514000d`,
        token: token,
      }
      dispatch(recipeAsync(apiRequestRecipe))
    }
  }, [])
  const recipe = useAppSelector(selectRecipeRecipe)
  const recipeInfo = RecipeRecord(recipe)
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Recipe - Recipe.Report</title>
          <link rel='canonical' href='https://my.recipe.report' />
        </Helmet>
        <div className={styles['container']}>{recipeInfo}</div>
      </HelmetProvider>
    </div>
  )
}

function RecipeRecord(recipe: RecipeDto | null | undefined): JSX.Element {
  return (
    <div>
      <h1>Recipe</h1>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{recipe?.name}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{recipe?.description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
