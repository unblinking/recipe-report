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
 * Version:     V4
 * Author:      Joshua Gray
 * Description: Create the feature type, and the features table.
 ******************************************************************************/

/**
 * Type:        rr.feature_type
 * Author:      Joshua Gray
 * Description: Type for an individual feature.
 * Attributes:  id UUID - Very low probability that a UUID will be duplicated.
 *              name VARCHAR (50) - 50 char limit for display purposes.
 *              description TEXT - 
 *              date_created TIMESTAMPTZ - 
 *              date_deleted TIMESTAMPTZ - 
 */
CREATE TYPE rr.feature_type AS (
    id              UUID,
    name            VARCHAR ( 50 ),
    description     TEXT,
    date_created    TIMESTAMPTZ,
    date_deleted    TIMESTAMPTZ
);
COMMENT ON TYPE rr.feature_type IS 'Type for an individual feature.';

/**
 * Table:       rr.features
 * Author:      Joshua Gray
 * Description: Table to store feature records.
 * Columns:     id - Primary key with default using the gen_random_uuid() function.
 *              name - Unique, and not null.
 *              description - Not null.
 *              date_created - Not null.
 *              date_deleted - 
 */
CREATE TABLE IF NOT EXISTS rr.features OF rr.feature_type (
    id            WITH OPTIONS PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          WITH OPTIONS UNIQUE NOT NULL,
    description   WITH OPTIONS        NOT NULL,
    date_created  WITH OPTIONS        NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE rr.features IS 'Table to store feature records.';
COMMENT ON COLUMN rr.features.id IS 'UUID primary key.';
COMMENT ON COLUMN rr.features.name IS 'Unique display name.';
COMMENT ON COLUMN rr.features.description IS 'Description of the feature.';
COMMENT ON COLUMN rr.features.date_created IS 'Datetime the feature was created in the database.';
COMMENT ON COLUMN rr.features.date_deleted IS 'Datetime the feature was marked as deleted.';

/**
 * Function:    rr.features_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the features table.
 * Parameters:  name VARCHAR(50) - Unique display name.
 *              description TEXT - 
 * Usage:       SELECT * FROM rr.features_create('foo', 'bar');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.features_create (
    name        VARCHAR( 50 ),
    description TEXT
)
    RETURNS  SETOF rr.features
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   rr.features (name, description)
    VALUES ($1, $2)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.features_create IS 'Function to create a record in the features table.';

/**
 * Function:    rr.features_read
 * Author:      Joshua Gray
 * Description: Function to read a feature by id.
 * Parameters:  id UUID
 * Usage:       SELECT * FROM rr.features_read('00000000-0000-0000-0000-000000000000');
 * Returns:     The feature record if found.
 */
CREATE OR REPLACE FUNCTION rr.features_read (
    id UUID
)
    RETURNS  SETOF rr.features
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM   rr.features
    WHERE  rr.features.id = $1;
END;
$$;
COMMENT ON FUNCTION rr.features_read IS 'Function to read a feature by id.';

/**
 * Function:    rr.features_update
 * Author:      Joshua Gray
 * Description: Function to update a record in the features table. The id and date_created cannot be
 *              changed. The password cannot be changed using this function.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 *              name VARCHAR( 50 ) - 
 *              description TEXT - 
 * Usage:       SELECT * FROM rr.features_update('00000000-0000-0000-0000-000000000000', 'foo', 'bar');
 * Returns:     The record that was updated.
 */
CREATE OR REPLACE FUNCTION rr.features_update (
    id          UUID,
    name        VARCHAR( 50 ) DEFAULT NULL,
    description TEXT          DEFAULT NULL
)
    RETURNS  SETOF rr.features
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    UPDATE rr.features
    SET
        name          = COALESCE($2, rr.features.name),
        description   = COALESCE($3, rr.features.description)
    WHERE rr.features.id = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.features_update IS 'Function to update a record in the features table.';

/**
 * Function:    rr.features_delete
 * Author:      Joshua Gray
 * Description: Function to delete a record in the features table (soft delete).
 * Parameters:  id UUID - Primary key id for the record to be deleted.
 * Usage:       SELECT * FROM rr.features_delete('00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was deleted.
 */
CREATE OR REPLACE FUNCTION rr.features_delete (
    id UUID
)
    RETURNS  SETOF rr.features
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    now TIMESTAMPTZ;
BEGIN
    SELECT CURRENT_TIMESTAMP INTO now;

    RETURN QUERY
    UPDATE rr.features
    SET    date_deleted = now
    WHERE  rr.features.id  = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.features_delete IS 'Function to delete a record in the features table (soft delete).';

/**
 * Function:    rr.features_count_by_column_value
 * Author:      Joshua Gray
 * Description: Function to return the count of feature records that match a given column/value.
 * Parameters:  column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.features_count_by_column_value('name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.features_count_by_column_value (
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM rr.features';
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
COMMENT ON FUNCTION rr.features_count_by_column_value IS 'Function to return the count of feature records that match a given column/value';

/**
 * Function:    rr.features_count_by_column_value_not_id
 * Author:      Joshua Gray
 * Description: Function to return the count of feature records, other than the specified feature id, that match a given column/value.
 * Parameters:  id UUID - The UUID of the record.
 *              column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.features_count_by_id_column_value('00000000-0000-0000-0000-000000000000', 'name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.features_count_by_column_value_not_id (
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
    query     text := 'SELECT COUNT(*) FROM rr.features';
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
COMMENT ON FUNCTION rr.features_count_by_column_value_not_id IS 'Function to return the count of feature records, other than the specified feature id, that match a given column/value.';
