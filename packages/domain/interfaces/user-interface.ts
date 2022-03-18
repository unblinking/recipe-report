/**
 * User DTO.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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
import { Account } from 'domain/models/account-model'
import { DisplayName } from 'domain/value/display-name-value'
import { EmailAddress } from 'domain/value/email-address-value'
import { Password } from 'domain/value/password-value'

export interface IUser {
  name: DisplayName
  password: Password
  email_address: EmailAddress
  accounts?: Account[]
  date_created?: Date
  date_activated?: Date
  date_last_login?: Date
  date_deleted?: Date
}
