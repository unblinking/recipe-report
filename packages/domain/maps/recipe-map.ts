/**
 * Recipe mapper.
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
 import type { IRecipe } from '@recipe-report/domain/interfaces'
 import { Err, errInternal, Recipe } from '@recipe-report/domain/models'
 import { DisplayName, UniqueId } from '@recipe-report/domain/values'
 
 export class RecipeMap {
   public static dtoToDomain(recipeDto: RecipeDto): Recipe {
     if (!this.isRecipe(recipeDto)) {
       throw new Err(`DOMAIN_OBJECT`, `RecipeMap: ${errInternal.DOMAIN_OBJECT}`)
     }
     return Recipe.create(
       {
         name: DisplayName.create(recipeDto.name),
         description: recipeDto.description,
         date_created: recipeDto.date_created ? new Date(recipeDto.date_created) : undefined,
         date_deleted: recipeDto.date_deleted ? new Date(recipeDto.date_deleted) : undefined,
       },
       UniqueId.create(recipeDto.id),
     )
   }
 
   public static dbToDomain(dbResult: RecipeDto, id: string): Recipe {
     if (!this.isRecipe(dbResult)) {
       throw new Err(`DOMAIN_OBJECT`, `RecipeMap: ${errInternal.DOMAIN_OBJECT}`)
     }
     return Recipe.create(
       {
         name: DisplayName.create(dbResult.name),
         description: dbResult.description,
         date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
         date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
       },
       UniqueId.create(id),
     )
   }
 
   public static domainToDto(recipe: Recipe): RecipeDto {
     return {
       id: recipe.id.value,
       name: recipe.name.value,
       description: recipe.description,
       date_created: recipe.date_created?.toString(),
       date_deleted: recipe.date_deleted?.toString(),
     }
   }
 
   // Type-guard using a type-predicate method.
   public static isRecipe(raw: unknown): raw is IRecipe {
     if (!(raw as IRecipe).name) return false
     if (!(raw as IRecipe).description) return false
     return true
   }
 }
 