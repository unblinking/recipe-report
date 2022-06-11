/**
 * Account interface.
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
import type { DisplayName, TimeZone, UniqueId } from '@recipe-report/domain/values'

export interface IAccount {
  name: DisplayName
  description?: string | undefined
  contact_user_id: UniqueId
  location_code?: string | undefined
  time_zone?: TimeZone | undefined
  address_country?: string | undefined
  address_locality?: string | undefined
  address_region?: string | undefined
  address_post_office_box?: string | undefined
  address_postal_code?: string | undefined
  address_street?: string | undefined
  date_created?: Date | undefined
  date_deleted?: Date | undefined
}
