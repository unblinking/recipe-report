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
 *              role TEXT -
 *              date_created TIMESTAMPTZ - 
 *              date_activated TIMESTAMPTZ - 
 *              date_last_login TIMESTAMPTZ - 
 */
CREATE TYPE rr.user_type AS (
    id UUID,
    name VARCHAR ( 50 ),
    password TEXT,
    email_address TEXT,
    role TEXT,
    date_created TIMESTAMPTZ,
    date_activated TIMESTAMPTZ,
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
 *              role - Not null.
 *              date_created - Not null.
 *              date_activated - 
 *              date_last_login - 
 */
CREATE TABLE IF NOT EXISTS rr.users OF rr.user_type (
    id WITH OPTIONS PRIMARY KEY DEFAULT gen_random_uuid(),
    name WITH OPTIONS UNIQUE NOT NULL,
    password WITH OPTIONS NOT NULL,
    email_address WITH OPTIONS UNIQUE NOT NULL,
    role WITH OPTIONS NOT NULL CHECK (role IN ('basic', 'manager', 'admin')) DEFAULT 'basic',
    date_created WITH OPTIONS NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX user_role_index ON rr.users (role);
COMMENT ON TABLE rr.users IS 'Table to store user records.';
COMMENT ON COLUMN rr.users.id IS 'UUID primary key.';
COMMENT ON COLUMN rr.users.name IS 'Unique display name.';
COMMENT ON COLUMN rr.users.password IS 'Salted/Hashed password using the pgcrypto crypt function, and gen_salt with the blowfish algorithm and iteration count of 8.';
COMMENT ON COLUMN rr.users.email_address IS 'Unique email address.';
COMMENT ON COLUMN rr.users.role IS 'Security level role.';
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
 *              role TEXT - 
 * Usage:       SELECT * FROM rr.users_create('foo', 'p@$$w0rd', 'foo@recipe.report', 'basic');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.users_create (
    name VARCHAR( 50 ),
    password TEXT,
    email_address TEXT,
    role TEXT
)
    RETURNS SETOF rr.users
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    saltedhash TEXT;
BEGIN
    SELECT crypt($2, gen_salt('bf', 8))
    INTO saltedhash;

    RETURN QUERY
    INSERT
    INTO rr.users (name, password, email_address, role)
    VALUES ($1, saltedhash, $3, $4)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.users_create IS 'Function to create a record in the users table.';
