/**
 * Base class for all repositories to extend from.
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
import type { dbTablesValueType } from '@recipe-report/data'
import type { PoolClient } from 'pg'

export interface IBaseRepo {
  client: PoolClient
}

export abstract class BaseRepo implements IBaseRepo {
  public client: PoolClient
  protected _table: dbTablesValueType

  constructor(client: PoolClient, table: dbTablesValueType) {
    this.client = client
    this._table = table
  }
}
