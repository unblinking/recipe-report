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
 */
CREATE TYPE rr.feature_type AS (
    id              UUID,
    name            VARCHAR ( 50 ),
    description     TEXT,
    date_created    TIMESTAMPTZ
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
