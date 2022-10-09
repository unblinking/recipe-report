/**
 * Recipe service.
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
 import { container, SYMBOLS } from '@recipe-report/api/ioc'
 import type { IUnitOfWork } from '@recipe-report/data/repositories'
 import { RecipeMap } from '@recipe-report/domain/maps'
 import { Err, errClient, isErrClient, Recipe } from '@recipe-report/domain/models'
 import { RecipeRequest, UuidRequest, RecipeResponse } from '@recipe-report/domain/services'
 import { DisplayName, UniqueId } from '@recipe-report/domain/values'
 import { injectable } from 'inversify'
 import 'reflect-metadata'
 
 export interface IRecipeService {
   create(req: RecipeRequest): Promise<RecipeResponse>
   read(req: UuidRequest): Promise<RecipeResponse>
   update(req: RecipeRequest): Promise<RecipeResponse>
   delete(req: UuidRequest): Promise<RecipeResponse>
 }
 
 @injectable()
 export class RecipeService implements IRecipeService {
   // public constructor() {}
 
   public async create(req: RecipeRequest): Promise<RecipeResponse> {
     // Get a new instance of uow from the DI container.
     const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)
 
     try {
       // Connect to the database and begin a transaction.
       await uow.connect()
       await uow.begin()
 
       // Create the entity in persistence.
       const recipe: Recipe = await uow.recipes.create(RecipeMap.dtoToDomain(req.recipe))
 
       // Commit the database transaction (also releases the connection.)
       await uow.commit()
 
       return RecipeResponse.success(RecipeMap.domainToDto(recipe))
     } catch (e) {
       // Attempt a rollback. If no database client exists, nothing will happen.
       await uow.rollback()
 
       // The caught e could be anything. Turn it into an Err.
       const err = Err.toErr(e)
 
       // If the error message can be client facing, return BAD_REQUEST.
       if (isErrClient(err.name)) {
         err.message = `${errClient.RECIPE_CREATE} ${err.message}`
         return RecipeResponse.fail(err)
       }
 
       // Do not leak internal error details, return INTERNAL_ERROR.
       return RecipeResponse.error(err)
     }
   }
 
   public async read(req: UuidRequest): Promise<RecipeResponse> {
     // Get a new instance of uow from the DI container.
     const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)
 
     try {
       // Connect to the database and begin a transaction.
       await uow.connect()
       await uow.begin()
 
       // Read the entity from persistence.
       const recipe: Recipe = await uow.recipes.read(req.id)
 
       // Commit the database transaction (also releases the connection.)
       await uow.commit()
 
       return RecipeResponse.success(RecipeMap.domainToDto(recipe))
     } catch (e) {
       // Attempt a rollback. If no database client exists, nothing will happen.
       await uow.rollback()
 
       // The caught e could be anything. Turn it into an Err.
       const err = Err.toErr(e)
 
       // If the error message can be client facing, return BAD_REQUEST.
       if (isErrClient(err.name)) {
         err.message = `${errClient.RECIPE_READ} ${err.message}`
         return RecipeResponse.fail(err)
       }
 
       // Do not leak internal error details, return INTERNAL_ERROR.
       return RecipeResponse.error(err)
     }
   }
 
   public async update(req: RecipeRequest): Promise<RecipeResponse> {
     // Get a new instance of uow from the DI container.
     const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)
 
     try {
       // Verify the request DTO has an id.
       if (!req.recipe.id) {
         throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} id`)
       }
       // Verify the request DTO has a name or description.
       // name and description are technically optional. Hopefully they're
       // updating at least one of those two though.
       if (!req.recipe.name && !req.recipe.description) {
         throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} at least one of name or description`)
       }
 
       // Connect to the database and begin a transaction.
       await uow.connect()
       await uow.begin()
 
       const id = UniqueId.create(req.recipe.id)
       const name = req.recipe.name != undefined ? DisplayName.create(req.recipe.name) : undefined
       const description = req.recipe.description != undefined ? req.recipe.description : undefined
 
       // Update the entity in persistence.
       const recipe: Recipe = await uow.recipes.update(id, name, description)
 
       // Commit the database transaction (also releases the connection.)
       await uow.commit()
 
       return RecipeResponse.success(RecipeMap.domainToDto(recipe))
     } catch (e) {
       // Attempt a rollback. If no database client exists, nothing will happen.
       await uow.rollback()
 
       // The caught e could be anything. Turn it into an Err.
       const err = Err.toErr(e)
 
       // If the error message can be client facing, return BAD_REQUEST.
       if (isErrClient(err.name)) {
         err.message = `${errClient.RECIPE_UPDATE} ${err.message}`
         return RecipeResponse.fail(err)
       }
 
       // Do not leak internal error details, return INTERNAL_ERROR.
       return RecipeResponse.error(err)
     }
   }
 
   public async delete(req: UuidRequest): Promise<RecipeResponse> {
     // Get a new instance of uow from the DI container.
     const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)
 
     try {
       // Connect to the database and begin a transaction.
       await uow.connect()
       await uow.begin()
 
       // Delete the entity from persistence (soft delete).
       const recipe: Recipe = await uow.recipes.delete(req.id)
 
       // Commit the database transaction (also releases the connection.)
       await uow.commit()
 
       return RecipeResponse.success(RecipeMap.domainToDto(recipe))
     } catch (e) {
       // Attempt a rollback. If no database client exists, nothing will happen.
       await uow.rollback()
 
       // The caught e could be anything. Turn it into an Err.
       const err = Err.toErr(e)
 
       // If the error message can be client facing, return BAD_REQUEST.
       if (isErrClient(err.name)) {
         err.message = `${errClient.RECIPE_DELETE} ${err.message}`
         return RecipeResponse.fail(err)
       }
 
       // Do not leak internal error details, return INTERNAL_ERROR.
       return RecipeResponse.error(err)
     }
   }
 }
 