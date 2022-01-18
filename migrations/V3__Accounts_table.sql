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
 * Description: Create the account type, and the accounts table.
 ******************************************************************************/

/**
 * Type:        rr.account_type
 * Author:      Joshua Gray
 * Description: Type for an individual account record.
 *              Some columns taken from https://schema.org/PostalAddress
 * Attributes:  id UUID - Very low probability that a UUID will be duplicated.
 *              name VARCHAR(50) - 50 char limit for display purposes.
 *              description TEXT - 
 *              contact_user_id UUID - 
 *              location_code TEXT - 
 *              time_zone TEXT - 
 *              address_country TEXT - 
 *              address_locality TEXT - 
 *              address_region TEXT - 
 *              address_post_office_box TEXT - 
 *              address_postal_code TEXT - 
 *              address_street TEXT - 
 *              date_created TIMESTAMPTZ - 
 *              date_deleted TIMESTAMPTZ - 
 */
CREATE TYPE rr.account_type AS (
    id                      UUID,
    name                    VARCHAR ( 50 ),
    description             TEXT,
    contact_user_id         UUID,
    location_code           TEXT,
    time_zone               TEXT,
    address_country         TEXT,
    address_locality        TEXT,
    address_region          TEXT,
    address_post_office_box TEXT,
    address_postal_code     TEXT,
    address_street          TEXT,
    date_created            TIMESTAMPTZ,
    date_deleted            TIMESTAMPTZ
);
COMMENT ON TYPE rr.account_type IS 'Type for an individual account record.';

/**
 * Table:       rr.accounts
 * Author:      Joshua Gray
 * Description: Table to store account records.
 * Columns:     id - Primary key with default using the gen_random_uuid() function.
 *              name - Unique, and not null.
 *              description - 
 *              contact_user_id - Not null.
 *              location_code - 
 *              time_zone - 
 *              address_country - 
 *              address_locality - 
 *              address_region - 
 *              address_post_office_box - 
 *              address_postal_code - 
 *              address_street - 
 *              date_created - Not null.
 *              date_deleted - 
 */
CREATE TABLE IF NOT EXISTS rr.accounts OF rr.account_type (
    id              WITH OPTIONS PRIMARY KEY      DEFAULT gen_random_uuid(),
    name            WITH OPTIONS UNIQUE NOT NULL,
    contact_user_id WITH OPTIONS        NOT NULL,
    date_created    WITH OPTIONS        NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact_user_accounts FOREIGN KEY (contact_user_id) REFERENCES rr.users (id) ON DELETE NO ACTION
);
CREATE INDEX accounts_name_index ON rr.accounts (name);
COMMENT ON TABLE rr.accounts IS 'Table to store account records.';
COMMENT ON COLUMN rr.accounts.id IS 'UUID primary key.';
COMMENT ON COLUMN rr.accounts.name IS 'Unique display name.';
COMMENT ON COLUMN rr.accounts.description IS 'Description of the account.';
COMMENT ON COLUMN rr.accounts.contact_user_id IS 'Primary contact user for the account from the rr.users table.';
COMMENT ON COLUMN rr.accounts.location_code IS 'User defined location id or code.';
COMMENT ON COLUMN rr.accounts.time_zone IS 'Olson time zone.';
COMMENT ON COLUMN rr.accounts.address_country IS 'The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code.';
COMMENT ON COLUMN rr.accounts.address_locality IS 'The locality in which the street address is, and which is in the region. For example, Mountain View.';
COMMENT ON COLUMN rr.accounts.address_region IS 'The region in which the locality is, and which is in the country. For example, California or another appropriate first-level Administrative division';
COMMENT ON COLUMN rr.accounts.address_post_office_box IS 'The post office box number for PO box addresses.';
COMMENT ON COLUMN rr.accounts.address_postal_code IS 'The postal code. For example, 94043.';
COMMENT ON COLUMN rr.accounts.address_street IS 'The street address. For example, 1600 Amphitheatre Pkwy.';
COMMENT ON COLUMN rr.accounts.date_created IS 'Datetime the account was created in the database.';
COMMENT ON COLUMN rr.accounts.date_deleted IS 'Datetime the account was marked as deleted.';

/**
 * Function:    rr.accounts_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the accounts table.
 * Parameters:  name VARCHAR(50) - Unique display name.
 *              contact_user_id UUID - Primary contact user for the account (from the rr.users table).
 * Usage:       SELECT * FROM rr.accounts_create('foo', '00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.accounts_create (
    name            VARCHAR( 50 ),
    contact_user_id UUID
)
    RETURNS  SETOF rr.accounts
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   rr.accounts (name, contact_user_id)
    VALUES ($1, $2)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.accounts_create IS 'Function to create a record in the accounts table.';

/**
 * Function:    rr.accounts_read
 * Author:      Joshua Gray
 * Description: Function to read an account by id.
 * Parameters:  id UUID
 * Usage:       SELECT * FROM rr.accounts_read('00000000-0000-0000-0000-000000000000');
 * Returns:     The account record if found.
 */
CREATE OR REPLACE FUNCTION rr.accounts_read (
    id UUID
)
    RETURNS  SETOF rr.accounts
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM   rr.accounts
    WHERE  rr.accounts.id = $1;
END;
$$;
COMMENT ON FUNCTION rr.accounts_read IS 'Function to read an account by id.';

/**
 * Function:    rr.accounts_update
 * Author:      Joshua Gray
 * Description: Function to update a record in the accounts table. The id and date_created cannot be
 *              changed.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 *              name VARCHAR( 50 ) - 
 *              description TEXT - 
 * Usage:       SELECT * FROM rr.accounts_update('00000000-0000-0000-0000-000000000000', 'foo', 'bar', '00000000-0000-0000-0000-000000000000', 'location1234', 'America/Los_Angeles', 'US', 'Mountain View', 'California', 'PO Box 1234', '94043', '1600 Amphitheatre Pkwy');
 * Returns:     The record that was updated.
 */
CREATE OR REPLACE FUNCTION rr.accounts_update (
    id                      UUID,
    name                    VARCHAR( 50 ) DEFAULT NULL,
    description             TEXT          DEFAULT NULL,
    contact_user_id         UUID          DEFAULT NULL,
    location_code           TEXT          DEFAULT NULL,
    time_zone               TEXT          DEFAULT NULL,
    address_country         TEXT          DEFAULT NULL,
    address_locality        TEXT          DEFAULT NULL,
    address_region          TEXT          DEFAULT NULL,
    address_post_office_box TEXT          DEFAULT NULL,
    address_postal_code     TEXT          DEFAULT NULL,
    address_street          TEXT          DEFAULT NULL
)
    RETURNS  SETOF rr.accounts
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    UPDATE rr.accounts
    SET
        name                    = COALESCE($2,  rr.accounts.name),
        description             = COALESCE($3,  rr.accounts.description),
        contact_user_id         = COALESCE($4,  rr.accounts.contact_user_id),
        location_code           = COALESCE($5,  rr.accounts.location_code),
        time_zone               = COALESCE($6,  rr.accounts.time_zone),
        address_country         = COALESCE($7,  rr.accounts.address_country),
        address_locality        = COALESCE($8,  rr.accounts.address_locality),
        address_region          = COALESCE($9,  rr.accounts.address_region),
        address_post_office_box = COALESCE($10, rr.accounts.address_post_office_box),
        address_postal_code     = COALESCE($11, rr.accounts.address_postal_code),
        address_street          = COALESCE($12, rr.accounts.address_street)
    WHERE rr.accounts.id = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.accounts_update IS 'Function to update a record in the accounts table.';

/**
 * Function:    rr.accounts_delete
 * Author:      Joshua Gray
 * Description: Function to delete a record in the accounts table (soft delete).
 * Parameters:  id UUID - Primary key id for the record to be deleted.
 * Usage:       SELECT * FROM rr.accounts_delete('00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was deleted.
 */
CREATE OR REPLACE FUNCTION rr.accounts_delete (
    id UUID
)
    RETURNS  SETOF rr.accounts
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    now TIMESTAMPTZ;
BEGIN
    SELECT CURRENT_TIMESTAMP INTO now;

    RETURN QUERY
    UPDATE rr.accounts
    SET    date_deleted = now
    WHERE  rr.accounts.id  = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.accounts_delete IS 'Function to delete a record in the accounts table (soft delete).';

/**
 * Function:    rr.accounts_count_by_column_value
 * Author:      Joshua Gray
 * Description: Function to return the count of account records that match a given column/value.
 * Parameters:  column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.accounts_count_by_column_value('name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.accounts_count_by_column_value (
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM rr.accounts';
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
COMMENT ON FUNCTION rr.accounts_count_by_column_value IS 'Function to return the count of account records that match a given column/value';

/**
 * Function:    rr.accounts_count_by_column_value_not_id
 * Author:      Joshua Gray
 * Description: Function to return the count of account records, other than the specified account id, that match a given column/value.
 * Parameters:  id UUID - The UUID of the record.
 *              column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.accounts_count_by_id_column_value('00000000-0000-0000-0000-000000000000', 'name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.accounts_count_by_column_value_not_id (
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
    query     text := 'SELECT COUNT(*) FROM rr.accounts';
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
COMMENT ON FUNCTION rr.accounts_count_by_column_value_not_id IS 'Function to return the count of account records, other than the specified account id, that match a given column/value.';
