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
 */

/*******************************************************************************
 * Migration:   Recipe.Report
 * Version:     V6
 * Author:      Joshua Gray
 * Description: Create the users-to-roles type, and the users-to-roles table.
 ******************************************************************************/

/**
 * Type:        rr.user_to_role_type
 * Author:      Joshua Gray
 * Description: Type for an individual user-to-role link.
 * Attributes:  user_id UUID - 
 *              role_id UUID - 
 *              account_id UUID - 
 *              date_created TIMESTAMPTZ - 
 */
CREATE TYPE rr.user_to_role_type AS (
    user_id      UUID,
    role_id      UUID,
    account_id   UUID,
    date_created TIMESTAMPTZ
);
COMMENT ON TYPE rr.user_to_role_type IS 'Type for an individual user-to-role link.';

/**
 * Table:       rr.users_to_roles
 * Author:      Joshua Gray
 * Description: Table to store individual user_to_role links.
 * Columns:     user_id - 
 *              role_id - 
 *              account_id - 
 *              date_created TIMESTAMPTZ - 
 */
CREATE TABLE IF NOT EXISTS rr.users_to_roles OF rr.user_to_role_type (
    user_id      WITH OPTIONS NOT NULL,
    role_id      WITH OPTIONS NOT NULL,
    account_id   WITH OPTIONS NOT NULL,
    date_created WITH OPTIONS NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id, account_id),
    CONSTRAINT fk_user_users_to_roles    FOREIGN KEY (user_id)    REFERENCES rr.users (id)    ON DELETE NO ACTION,
    CONSTRAINT fk_role_users_to_roles    FOREIGN KEY (role_id)    REFERENCES rr.roles (id)    ON DELETE NO ACTION,
    CONSTRAINT fk_account_users_to_roles FOREIGN KEY (account_id) REFERENCES rr.accounts (id) ON DELETE NO ACTION
);
COMMENT ON TABLE rr.users_to_roles IS 'Table to store individual user_to_role links.';
COMMENT ON COLUMN rr.users_to_roles.user_id IS 'UUID of a record from the rr.users table.';
COMMENT ON COLUMN rr.users_to_roles.role_id IS 'UUID of a record from the rr.roles table.';
COMMENT ON COLUMN rr.users_to_roles.account_id IS 'UUID of a record from the rr.accounts table.';
COMMENT ON COLUMN rr.users_to_roles.date_created IS 'Datetime the record was created in the database.';

/**
 * Function:    rr.users_to_roles_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the users_to_roles table.
 * Parameters:  user_id UUID - 
 *              role_id UUID - 
 *              account_id UUID - 
 * Usage:       SELECT * FROM rr.users_to_roles_create('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.users_to_roles_create (
    user_id    UUID,
    role_id    UUID,
    account_id UUID
)
    RETURNS  SETOF rr.users_to_roles
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   rr.users_to_roles (user_id, role_id, account_id)
    VALUES ($1, $2, $3)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.users_to_roles_create IS 'Function to create a record in the users_to_roles table.';

/**
 * Function:    rr.users_to_roles_read_by_user_id
 * Author:      Joshua Gray
 * Description: Function to read all users_to_roles link records by user_id.
 * Parameters:  user_id UUID
 * Usage:       SELECT * FROM rr.users_to_roles_read_by_user_id('00000000-0000-0000-0000-000000000000');
 * Returns:     The user_to_roles link records if found.
 */
CREATE OR REPLACE FUNCTION rr.users_to_roles_read_by_user_id (
    user_id UUID
)
    RETURNS  SETOF rr.users_to_roles
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM  rr.users_to_roles
    WHERE rr.users_to_roles.user_id = $1;
END;
$$;
COMMENT ON FUNCTION rr.users_to_roles_read_by_user_id IS 'Function to read all user_to_role link records by user_id.';

/**
 * Function:    rr.users_to_roles_read_by_account_id
 * Author:      Joshua Gray
 * Description: Function to read all users_to_roles link records by account_id.
 * Parameters:  account_id UUID
 * Usage:       SELECT * FROM rr.users_to_roles_read_by_account_id('00000000-0000-0000-0000-000000000000');
 * Returns:     The user_to_roles link records if found.
 */
CREATE OR REPLACE FUNCTION rr.users_to_roles_read_by_account_id (
    account_id UUID
)
    RETURNS  SETOF rr.users_to_roles
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM  rr.users_to_roles
    WHERE rr.users_to_roles.account_id = $1;
END;
$$;
COMMENT ON FUNCTION rr.users_to_roles_read_by_account_id IS 'Function to read all user_to_role link records by account_id.';

/**
 * Function:    rr.users_to_roles_delete
 * Author:      Joshua Gray
 * Description: Function to delete a record in the users_to_roles table (hard delete).
 * Parameters:  user_id UUID - 
 *              role_id UUID - 
 * Usage:       SELECT * FROM rr.users_to_roles_delete('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was deleted.
 */
CREATE OR REPLACE FUNCTION rr.users_to_roles_delete (
    user_id    UUID,
    role_id    UUID,
    account_id UUID
)
    RETURNS  SETOF rr.users_to_roles
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    DELETE
    FROM  rr.users_to_roles
    WHERE rr.users_to_roles.user_id    = $1
    AND   rr.users_to_roles.role_id    = $2
    AND   rr.users_to_roles.account_id = $3
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.users_to_roles_delete IS 'Function to delete a record in the users_to_roles table (hard delete).';
