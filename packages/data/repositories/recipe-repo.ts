/**
 * Recipe repository.
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
 import { dbTables } from '@recipe-report/data'
 import type { IBaseRepo } from '@recipe-report/data/repositories'
 import { BaseRepo } from '@recipe-report/data/repositories'
 import { RecipeMap } from '@recipe-report/domain/maps'
 import { Err, errClient, Recipe } from '@recipe-report/domain/models'
 import type { DisplayName, UniqueId } from '@recipe-report/domain/values'
 import type { PoolClient, QueryResult } from 'pg'
 
 export interface IRecipeRepo extends IBaseRepo {
   create(recipe: Recipe): Promise<Recipe>
   read(id: UniqueId): Promise<Recipe>
   update(id: UniqueId, name?: DisplayName, description?: string): Promise<Recipe>
   delete(id: UniqueId): Promise<Recipe>
 }
 
 export class RecipeRepo extends BaseRepo implements IRecipeRepo {
   constructor(client: PoolClient) {
     super(client, dbTables.RECIPES)
   }
 
   public create = async (recipe: Recipe): Promise<Recipe> => {
     // Verify no existing recipe by name.
     if ((await this._countByColumn('name', recipe.name.value)) > 0) {
       throw new Err(`NAME_USED`, errClient.NAME_USED)
     }
     // Save the recipe into the database.
     const query: string = `SELECT * FROM rr.recipes_create($1, $2)`
     const result: QueryResult = await this.client.query(query, [
       recipe.name.value,
       recipe.description,
     ])
     // Return domain object from database query results.
     return RecipeMap.dbToDomain(result.rows[0], result.rows[0].id)
   }
 
   public read = async (id: UniqueId): Promise<Recipe> => {
     // Find the recipe by their unique id.
     const query: string = `SELECT * FROM rr.recipes_read($1)`
     const result: QueryResult = await this.client.query(query, [id.value])
     if (result.rowCount !== 1) {
       throw new Err(`RECIPE_READ`, errClient.RECIPE_READ)
     }
     // Return domain object from database query results.
     return RecipeMap.dbToDomain(result.rows[0], result.rows[0].id)
   }
 
   public update = async (
     id: UniqueId,
     name?: DisplayName,
     description?: string,
   ): Promise<Recipe> => {
     // Verify the incoming recipe name isn't being used by any recipe, except of
     // course if used by the recipe we are going to update now.
     if (name != undefined && (await this._countByColumnNotId(id.value, 'name', name.value)) > 0) {
       throw new Err(`NAME_USED`, errClient.NAME_USED)
     }
     // Update the recipe into the database.
     const query: string = `SELECT * FROM rr.recipes_update($1, $2, $3)`
     const result: QueryResult = await this.client.query(query, [
       id.value,
       name != undefined ? name.value : null,
       description != undefined ? description : null,
     ])
     if (result.rowCount !== 1) {
       throw new Err(`RECIPE_UPDATE`, errClient.RECIPE_UPDATE)
     }
     // Return domain object from database query results.
     return RecipeMap.dbToDomain(result.rows[0], result.rows[0].id)
   }
 
   public delete = async (id: UniqueId): Promise<Recipe> => {
     // Delete the recipe by their unique id.
     const query: string = `SELECT * FROM rr.recipes_delete($1)`
     const result: QueryResult = await this.client.query(query, [id.value])
     if (result.rowCount !== 1) {
       throw new Err(`RECIPE_DELETE`, errClient.RECIPE_DELETE)
     }
     // Return domain object from database query results.
     return RecipeMap.dbToDomain(result.rows[0], result.rows[0].id)
   }
 
   // Function to return the count of recipe records that match a given column/value
   private _countByColumn = async (column: string, value: string): Promise<number> => {
     const query: string = `SELECT * FROM rr.recipes_count_by_column_value($1, $2)`
     const result: QueryResult = await this.client.query(query, [column, value])
     const count: number = result.rows[0].recipes_count_by_column_value
     return count
   }
 
   // Function to return the count of records, other than the specified record id, that match a given column/value
   private _countByColumnNotId = async (
     id: string,
     column: string,
     value: string,
   ): Promise<number> => {
     const query: string = `SELECT * FROM rr.recipes_count_by_column_value_not_id($1, $2, $3)`
     const result: QueryResult = await this.client.query(query, [id, column, value])
     const count: number = result.rows[0].recipes_count_by_id_column_value
     return count
   }
 }
 