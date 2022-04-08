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
 * @see {@link https://github.com/nothingworksright/recipe-report}
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
 * Version:     V1
 * Author:      Joshua Gray
 * Description: Initialize the Recipe.Report database, creating the schema, and
 *              a function to return table types.
 ******************************************************************************/

/**
 * Schema:      rr
 * Author:      Joshua Gray
 * Description: The namespace for Recipe.Report types, tables, and functions.
 */
CREATE SCHEMA IF NOT EXISTS rr;
COMMENT ON SCHEMA rr IS 'The namespace for Recipe.Report types, tables, and functions.';

/**
 * Function:    rr.get_table_types
 * Author:      Joshua Gray
 * Description: Function to return table column types.
 * Parameters:  table_name TEXT - The name of the table without the schema.
 * Usage:       SELECT * FROM rr.get_table_types('users');
 * Returns:     column_name, data_type
 */
CREATE OR REPLACE FUNCTION rr.get_table_types (table_name TEXT)
    RETURNS TABLE (column_name VARCHAR ( 255 ), data_type VARCHAR ( 255 ))
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS table_information_schema_columns(
        column_name VARCHAR ( 255 ),
        data_type VARCHAR ( 255 )
    ) ON COMMIT DROP;

    INSERT INTO table_information_schema_columns ( column_name, data_type )
    SELECT isc.column_name, isc.data_type
    FROM information_schema.columns as isc
    WHERE isc.table_name = $1;

    RETURN QUERY
    SELECT *
    FROM table_information_schema_columns;
END;
$$;
COMMENT ON FUNCTION rr.get_table_types IS 'Function to return table column types.';
