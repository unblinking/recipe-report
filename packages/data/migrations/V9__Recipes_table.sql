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
 * Version:     V9
 * Author:      Joshua Gray
 * Description: Create the recipe type, and the recipes table.
 ******************************************************************************/

/**
 * Type:        rr.recipe_type
 * Author:      Joshua Gray
 * Description: Type for an individual recipe.
 * Attributes:  id UUID - Very low probability that a UUID will be duplicated.
 *              name VARCHAR (50) - 50 char limit for display purposes.
 *              description TEXT - 
 *              date_created TIMESTAMPTZ - 
 *              date_deleted TIMESTAMPTZ - 
 */
CREATE TYPE rr.recipe_type AS (
    id              UUID,
    name            VARCHAR ( 50 ),
    description     TEXT,
    date_created    TIMESTAMPTZ,
    date_deleted    TIMESTAMPTZ
);
COMMENT ON TYPE rr.recipe_type IS 'Type for an individual recipe.';

/**
 * Table:       rr.recipes
 * Author:      Joshua Gray
 * Description: Table to store recipe records.
 * Columns:     id - Primary key with default using the gen_random_uuid() function.
 *              name - Unique, and not null.
 *              description - Not null.
 *              date_created - Not null.
 *              date_deleted - 
 */
CREATE TABLE IF NOT EXISTS rr.recipes OF rr.recipe_type (
    id            WITH OPTIONS PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          WITH OPTIONS UNIQUE NOT NULL,
    description   WITH OPTIONS        NOT NULL,
    date_created  WITH OPTIONS        NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE rr.recipes IS 'Table to store recipe records.';
COMMENT ON COLUMN rr.recipes.id IS 'UUID primary key.';
COMMENT ON COLUMN rr.recipes.name IS 'Unique display name.';
COMMENT ON COLUMN rr.recipes.description IS 'Description of the recipe.';
COMMENT ON COLUMN rr.recipes.date_created IS 'Datetime the recipe was created in the database.';
COMMENT ON COLUMN rr.recipes.date_deleted IS 'Datetime the recipe was marked as deleted.';

/**
 * Function:    rr.recipes_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the recipes table.
 * Parameters:  name VARCHAR(50) - Unique display name.
 *              description TEXT - 
 * Usage:       SELECT * FROM rr.recipes_create('foo', 'bar');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.recipes_create (
    name        VARCHAR( 50 ),
    description TEXT
)
    RETURNS  SETOF rr.recipes
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   rr.recipes (name, description)
    VALUES ($1, $2)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.recipes_create IS 'Function to create a record in the recipes table.';

/**
 * Function:    rr.recipes_read
 * Author:      Joshua Gray
 * Description: Function to read a recipe by id.
 * Parameters:  id UUID
 * Usage:       SELECT * FROM rr.recipes_read('00000000-0000-0000-0000-000000000000');
 * Returns:     The recipe record if found.
 */
CREATE OR REPLACE FUNCTION rr.recipes_read (
    id UUID
)
    RETURNS  SETOF rr.recipes
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM   rr.recipes
    WHERE  rr.recipes.id = $1;
END;
$$;
COMMENT ON FUNCTION rr.recipes_read IS 'Function to read a recipe by id.';

/**
 * Function:    rr.recipes_update
 * Author:      Joshua Gray
 * Description: Function to update a record in the recipes table. The id and date_created cannot be
 *              changed. The password cannot be changed using this function.
 * Parameters:  id UUID - Primary key id for the record to be updated.
 *              name VARCHAR( 50 ) - 
 *              description TEXT - 
 * Usage:       SELECT * FROM rr.recipes_update('00000000-0000-0000-0000-000000000000', 'foo', 'bar');
 * Returns:     The record that was updated.
 */
CREATE OR REPLACE FUNCTION rr.recipes_update (
    id          UUID,
    name        VARCHAR( 50 ) DEFAULT NULL,
    description TEXT          DEFAULT NULL
)
    RETURNS  SETOF rr.recipes
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    UPDATE rr.recipes
    SET
        name          = COALESCE($2, rr.recipes.name),
        description   = COALESCE($3, rr.recipes.description)
    WHERE rr.recipes.id = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.recipes_update IS 'Function to update a record in the recipes table.';

/**
 * Function:    rr.recipes_delete
 * Author:      Joshua Gray
 * Description: Function to delete a record in the recipes table (soft delete).
 * Parameters:  id UUID - Primary key id for the record to be deleted.
 * Usage:       SELECT * FROM rr.recipes_delete('00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was deleted.
 */
CREATE OR REPLACE FUNCTION rr.recipes_delete (
    id UUID
)
    RETURNS  SETOF rr.recipes
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    now TIMESTAMPTZ;
BEGIN
    SELECT CURRENT_TIMESTAMP INTO now;

    RETURN QUERY
    UPDATE rr.recipes
    SET    date_deleted = now
    WHERE  rr.recipes.id  = $1
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.recipes_delete IS 'Function to delete a record in the recipes table (soft delete).';

/**
 * Function:    rr.recipes_count_by_column_value
 * Author:      Joshua Gray
 * Description: Function to return the count of recipe records that match a given column/value.
 * Parameters:  column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.recipes_count_by_column_value('name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.recipes_count_by_column_value (
    column_name  TEXT,
    column_value TEXT
)
    RETURNS  integer
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    row_count integer;
    query     text := 'SELECT COUNT(*) FROM rr.recipes';
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
COMMENT ON FUNCTION rr.recipes_count_by_column_value IS 'Function to return the count of recipe records that match a given column/value';

/**
 * Function:    rr.recipes_count_by_column_value_not_id
 * Author:      Joshua Gray
 * Description: Function to return the count of recipe records, other than the specified recipe id, that match a given column/value.
 * Parameters:  id UUID - The UUID of the record.
 *              column_name TEXT - The name of the column to match on.
 *              column_value TEXT - The value of the column to match on.
 * Usage:       SELECT * FROM rr.recipes_count_by_id_column_value('00000000-0000-0000-0000-000000000000', 'name', 'foo');
 * Returns:     An integer count of the number of matching records found.
 */
CREATE OR REPLACE FUNCTION rr.recipes_count_by_column_value_not_id (
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
    query     text := 'SELECT COUNT(*) FROM rr.recipes';
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
COMMENT ON FUNCTION rr.recipes_count_by_column_value_not_id IS 'Function to return the count of recipe records, other than the specified recipe id, that match a given column/value.';
