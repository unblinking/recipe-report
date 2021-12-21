/**
 * The application entry point and composition root.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/api.recipe.report}
 *
 * Recipe.Report API Server is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report API Server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import { container } from './ioc.config'
import { IRecipeReport } from './recipereport'
import { TYPES } from './types'

// Composition root: https://blog.ploeh.dk/2011/07/28/CompositionRoot/
// Time to compose the entire object graph! Exciting!
const recipeReport = container.get<IRecipeReport>(TYPES.IRecipeReport)

// Now we pull down on the propeller and see if this thing will start.
recipeReport.start()