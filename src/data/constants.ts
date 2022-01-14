/**
 * Global constants.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * Based on an approach in an article titled "How to Share Constants in
 * Typescript Project" by Sunny Sun. 7/25/2021.
 * @see {@link https://medium.com/codex/how-to-share-constants-in-typescript-project-8f76a2e40352}
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

/**
 * Database table names.
 */
export const dbTables = {
  ACCOUNTS: `rr.accounts`,
  FEATURES: `rr.features`,
  ROLES: `rr.roles`,
  ROLES_TO_FEATURES: `rr.roles_to_features`,
  USERS: `rr.users`,
  USERS_TO_ROLES: `rr.users_to_roles`,
} as const
type dbTablesType = typeof dbTables
export type dbTablesKeyType = keyof dbTablesType
export type dbTablesValueType = dbTablesType[keyof dbTablesType]

/**
 * HTTP response status codes.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
 */
export const httpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const
type httpStatusType = typeof httpStatus
export type httpStatusKeyType = keyof httpStatusType
export type httpStatusValueType = httpStatusType[keyof httpStatusType]

/**
 * Outcomes of service layer requests.
 */
export const outcomes = {
  SUCCESS: `success`,
  FAIL: `fail`,
  ERROR: `error`,
} as const
type outcomeType = typeof outcomes
export type outcomeKeyType = keyof outcomeType
export type outcomeValueType = outcomeType[keyof outcomeType]
