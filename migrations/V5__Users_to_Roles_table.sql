/**
 * Database migration for Recipe.Report.
 * 
 * Using PostgreSQL for database.
 * @see {@link https://www.postgresql.org/ PostgreSQL}
 * 
 * Using Flyway for database migrations.
 * @see {@link https://flywaydb.org/documentation/database/postgresql Flyway}
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
 */

/*******************************************************************************
 * Migration:   Recipe.Report
 * Version:     V5
 * Author:      Joshua Gray
 * Description: Create the users-to-roles type, and the users-to-roles table.
 ******************************************************************************/

/**
 * Type:        rr.user_to_role_type
 * Author:      Joshua Gray
 * Description: Type for an individual user-to-role link.
 * Attributes:  user_id UUID - 
 *              role_id UUID - 
 */
CREATE TYPE rr.user_to_role_type AS (
    user_id UUID,
    role_id UUID
);
COMMENT ON TYPE rr.user_to_role_type IS 'Type for an individual user-to-role link.';

/**
 * Table:       rr.users_to_roles
 * Author:      Joshua Gray
 * Description: Table to store individual user_to_role links.
 * Columns:     user_id - 
 *              role_id - 
 */
CREATE TABLE IF NOT EXISTS rr.users_to_roles OF rr.user_to_role_type (
    user_id WITH OPTIONS NOT NULL,
    role_id WITH OPTIONS NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_users_to_roles FOREIGN KEY (user_id) REFERENCES rr.users (id) ON DELETE NO ACTION,
    CONSTRAINT fk_role_users_to_roles FOREIGN KEY (role_id) REFERENCES rr.roles (id) ON DELETE NO ACTION
);
COMMENT ON TABLE rr.users_to_roles IS 'Table to store individual user_to_role links.';
COMMENT ON COLUMN rr.users_to_roles.user_id IS 'UUID of a record from the rr.users table.';
COMMENT ON COLUMN rr.users_to_roles.role_id IS 'UUID of a record from the rr.roles table.';
