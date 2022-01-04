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
 * Version:     V2
 * Author:      Joshua Gray
 * Description: Create the user type, and the users table.
 ******************************************************************************/

/**
 * Type:        rr.user_type
 * Author:      Joshua Gray
 * Description: Type for an individual user record including login credentials.
 * Attributes:  id UUID - Very low probability that a UUID will be duplicated.
 *              name VARCHAR(50) - 50 char limit for display purposes.
 *              password TEXT - Salted/hashed passwords using pgcrypto.
 *              email_address TEXT - 
 *              date_created TIMESTAMPTZ - 
 *              date_activated TIMESTAMPTZ - 
 *              date_last_login TIMESTAMPTZ - 
 */
CREATE TYPE rr.user_type AS (
    id              UUID,
    name            VARCHAR ( 50 ),
    password        TEXT,
    email_address   TEXT,
    date_created    TIMESTAMPTZ,
    date_activated  TIMESTAMPTZ,
    date_last_login TIMESTAMPTZ
);
COMMENT ON TYPE rr.user_type IS 'Type for an individual user record including login credentials.';

/**
 * Table:       rr.users
 * Author:      Joshua Gray
 * Description: Table to store user records.
 * Columns:     id - Primary key with default using the gen_random_uuid() function.
 *              name - Unique, and not null.
 *              password - Not null.
 *              email_address - Unique, and not null.
 *              date_created - Not null.
 *              date_activated - 
 *              date_last_login - 
 */
CREATE TABLE IF NOT EXISTS rr.users OF rr.user_type (
    id            WITH OPTIONS PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          WITH OPTIONS UNIQUE NOT NULL,
    password      WITH OPTIONS        NOT NULL,
    email_address WITH OPTIONS UNIQUE NOT NULL,
    date_created  WITH OPTIONS        NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE rr.users IS 'Table to store user records.';
COMMENT ON COLUMN rr.users.id IS 'UUID primary key.';
COMMENT ON COLUMN rr.users.name IS 'Unique display name.';
COMMENT ON COLUMN rr.users.password IS 'Salted/Hashed password using the pgcrypto crypt function, and gen_salt with the blowfish algorithm and iteration count of 8.';
COMMENT ON COLUMN rr.users.email_address IS 'Unique email address.';
COMMENT ON COLUMN rr.users.date_created IS 'Datetime the user was created in the database.';
COMMENT ON COLUMN rr.users.date_activated IS 'Datetime the user was activated for login.';
COMMENT ON COLUMN rr.users.date_last_login IS 'Datetime the user last logged into the system successfully.';

/**
 * Function:    rr.users_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the users table.
 * Parameters:  name VARCHAR(50) - Unique user display name.
 *              password TEXT - Plain text user password that will be salted/hashed.
 *              email_address TEXT - 
 * Usage:       SELECT * FROM rr.users_create('foo', 'p@$$w0rd', 'foo@recipe.report', 'basic');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.users_create (
    name          VARCHAR( 50 ),
    password      TEXT,
    email_address TEXT
)
    RETURNS  SETOF rr.users
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    saltedhash TEXT;
BEGIN
    SELECT crypt($2, gen_salt('bf', 8))
    INTO   saltedhash;

    RETURN QUERY
    INSERT
    INTO   rr.users (name, password, email_address)
    VALUES ($1, saltedhash, $3)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.users_create IS 'Function to create a record in the users table.';

/**
 * Function:    rr.users_read
 * Author:      Joshua Gray
 * Description: Function to read a user by id.
 * Parameters:  id UUID
 * Usage:       SELECT * FROM rr.users_read('00000000-0000-0000-0000-000000000000');
 * Returns:     The user record if found.
 */
CREATE OR REPLACE FUNCTION rr.users_read (
    id UUID
)
    RETURNS  SETOF rr.users
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM   rr.users
    WHERE  rr.users.id = $1;
END;
$$;
COMMENT ON FUNCTION rr.users_read IS 'Function to read a user by id.';

/**
 * Function:    rr.users_update
 * Author:      Joshua Gray
 * Description: Function to update a record in the users table. The id and date_created cannot be
 *              changed. The password cannot be changed using this function.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 *              name VARCHAR( 50 ) - 
 *              email_address TEXT - 
 * Usage:       SELECT * FROM rr.users_update('00000000-0000-0000-0000-000000000000', 'foo', 'foo@recipe.report');
 * Returns:     The record that was updated.
 */
CREATE OR REPLACE FUNCTION rr.users_update (
    id            UUID,
    name          VARCHAR( 50 ) DEFAULT NULL,
    email_address TEXT          DEFAULT NULL
)
    RETURNS SETOF rr.users
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    UPDATE rr.users
    SET
        name          = COALESCE($2, rr.users.name),
        email_address = COALESCE($3, rr.users.email_address)
    WHERE rr.users.id = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.users_update IS 'Function to update a record in the users table.';

/**
 * Function:    rr.users_activate
 * Author:      Joshua Gray
 * Description: Function to update a record in the users table with a new date_activated.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 * Usage:       SELECT * FROM rr.users_activate('00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was updated.
 */
CREATE OR REPLACE FUNCTION rr.users_activate (
    id UUID
)
    RETURNS  SETOF rr.users
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    now TIMESTAMPTZ;
BEGIN
    SELECT CURRENT_TIMESTAMP INTO now;

    RETURN QUERY
    UPDATE rr.users
    SET    date_activated = now
    WHERE  rr.users.id    = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.users_activate IS 'Function to update a record in the users table with a new date_activated.';

/**
 * Function:    rr.users_update_date_last_login
 * Author:      Joshua Gray
 * Description: Function to update a record in the users table with a new date_last_login.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 * Usage:       SELECT * FROM rr.users_update_date_last_login('00000000-0000-0000-0000-000000000000');
 * Returns:     True if the user date_last_login was updated, and false if not.
 */
CREATE OR REPLACE FUNCTION rr.users_update_date_last_login (
    id UUID
)
    RETURNS  BOOLEAN
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    now TIMESTAMPTZ;
BEGIN
    SELECT CURRENT_TIMESTAMP INTO now;

    UPDATE rr.users
    SET    date_last_login = now
    WHERE  rr.users.id     = $1;
    RETURN FOUND;
END;
$$;
COMMENT ON FUNCTION rr.users_update_date_last_login IS 'Function to update a record in the users table with a new date_last_login.';

/**
 * Function:    rr.users_authenticate
 * Author:      Joshua Gray
 * Description: Function to authenticate a user by email address and password.
 * Parameters:  email_address TEXT - 
 *              password TEXT -
 * Usage:       SELECT * FROM rr.users_authenticate('foo@recipe.report', 'passwordfoo');
 * Returns:     The user record if found.
 */
CREATE OR REPLACE FUNCTION rr.users_authenticate (
    email_address TEXT,
    password      TEXT
)
    RETURNS  SETOF rr.users
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM    rr.users
    WHERE   rr.users.email_address = $1
        AND rr.users.password      = crypt($2, rr.users.password);
END;
$$;
COMMENT ON FUNCTION rr.users_authenticate IS 'Function to authenticate a user by email address and password.';

/**
 * Function:    rr.users_count_by_column_value
 * Author:      Joshua Gray
 * Description: Function to return the count of user records that match a given column/value.
 * Parameters:  column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.users_count_by_column_value('name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.users_count_by_column_value (
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM rr.users';
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
COMMENT ON FUNCTION rr.users_count_by_column_value IS 'Function to return the count of user records that match a given column/value';

/**
 * Function:    rr.users_count_by_column_value_not_id
 * Author:      Joshua Gray
 * Description: Function to return the count of user records, other than the specified user id, that match a given column/value.
 * Parameters:  id UUID - The UUID of the record.
 *              column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.users_count_by_id_column_value('00000000-0000-0000-0000-000000000000', 'name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.users_count_by_column_value_not_id (
    id_value     UUID,
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM rr.users';
BEGIN
    IF id_value IS NOT NULL AND column_name IS NOT NULL THEN
        query := query || ' WHERE id != $1 AND ' || quote_ident(column_name) || ' = $2';
    END IF;
    EXECUTE query
    USING   id_value, column_value
    INTO    row_count;
    RETURN  row_count;
END;
$$;
COMMENT ON FUNCTION rr.users_count_by_column_value_not_id IS 'Function to return the count of user records, other than the specified user id, that match a given column/value.';
