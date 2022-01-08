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
 * Version:     V3
 * Author:      Joshua Gray
 * Description: Create the role type, and the roles table.
 ******************************************************************************/

/**
 * Type:        rr.role_type
 * Author:      Joshua Gray
 * Description: Type for an individual role.
 * Attributes:  id UUID - Very low probability that a UUID will be duplicated.
 *              name VARCHAR (50) - 50 char limit for display purposes.
 *              description TEXT - 
 *              date_created TIMESTAMPTZ - 
 */
CREATE TYPE rr.role_type AS (
    id              UUID,
    name            VARCHAR ( 50 ),
    description     TEXT,
    date_created    TIMESTAMPTZ
);
COMMENT ON TYPE rr.role_type IS 'Type for an individual role.';

/**
 * Table:       rr.roles
 * Author:      Joshua Gray
 * Description: Table to store role records.
 * Columns:     id - Primary key with default using the gen_random_uuid() function.
 *              name - Unique, and not null.
 *              description - Not null.
 *              date_created - Not null.
 */
CREATE TABLE IF NOT EXISTS rr.roles OF rr.role_type (
    id            WITH OPTIONS PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          WITH OPTIONS UNIQUE NOT NULL,
    description   WITH OPTIONS        NOT NULL,
    date_created  WITH OPTIONS        NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE rr.roles IS 'Table to store role records.';
COMMENT ON COLUMN rr.roles.id IS 'UUID primary key.';
COMMENT ON COLUMN rr.roles.name IS 'Unique display name.';
COMMENT ON COLUMN rr.roles.description IS 'Description of the role.';
COMMENT ON COLUMN rr.roles.date_created IS 'Datetime the role was created in the database.';

/**
 * Function:    rr.roles_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the roles table.
 * Parameters:  name VARCHAR(50) - Unique display name.
 *              description TEXT - 
 * Usage:       SELECT * FROM rr.roles_create('foo', 'bar');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.roles_create (
    name        VARCHAR( 50 ),
    description TEXT
)
    RETURNS  SETOF rr.roles
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   rr.roles (name, description)
    VALUES ($1, $2)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.roles_create IS 'Function to create a record in the roles table.';

/**
 * Function:    rr.roles_count_by_column_value
 * Author:      Joshua Gray
 * Description: Function to return the count of role records that match a given column/value.
 * Parameters:  column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.roles_count_by_column_value('name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.roles_count_by_column_value (
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM rr.roles';
BEGIN
    IF column_name IS NOT NULL THEN
        query := query || ' WHERE ' || quote_ident(column_name) || ' = $1';
    END IF;
    EXECUTE query
    USING   column_value
    INTO    row_count;
    RETURN  row_count;
END;
$$;
COMMENT ON FUNCTION rr.roles_count_by_column_value IS 'Function to return the count of role records that match a given column/value';
