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
 * @see {@link https://github.com/unblinking/recipe-report}
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
 * Version:     V7
 * Author:      Joshua Gray
 * Description: Create the role_to_feature type, and the roles_to_features table.
 ******************************************************************************/

/**
 * Type:        rr.role_to_feature_type
 * Author:      Joshua Gray
 * Description: Type for an individual role_to_feature link.
 * Attributes:  role_id UUID - 
 *              feature_id UUID - 
 *              date_created TIMESTAMPTZ - 
 */
CREATE TYPE rr.role_to_feature_type AS (
    role_id      UUID,
    feature_id   UUID,
    date_created TIMESTAMPTZ
);
COMMENT ON TYPE rr.role_to_feature_type IS 'Type for an individual role_to_feature link.';

/**
 * Table:       rr.roles_to_features
 * Author:      Joshua Gray
 * Description: Table to store individual role_to_feature links.
 * Columns:     role_id - 
 *              feature_id - 
 *              date_created TIMESTAMPTZ - 
 */
CREATE TABLE IF NOT EXISTS rr.roles_to_features OF rr.role_to_feature_type (
    role_id      WITH OPTIONS NOT NULL,
    feature_id   WITH OPTIONS NOT NULL,
    date_created WITH OPTIONS NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, feature_id),
    CONSTRAINT fk_role_roles_to_features    FOREIGN KEY (role_id)    REFERENCES rr.roles (id)    ON DELETE NO ACTION,
    CONSTRAINT fk_feature_roles_to_features FOREIGN KEY (feature_id) REFERENCES rr.features (id) ON DELETE NO ACTION
);
COMMENT ON TABLE rr.roles_to_features IS 'Table to store individual role_to_feature links.';
COMMENT ON COLUMN rr.roles_to_features.role_id IS 'UUID of a record from the rr.roles table.';
COMMENT ON COLUMN rr.roles_to_features.feature_id IS 'UUID of a record from the rr.features table.';
COMMENT ON COLUMN rr.roles_to_features.date_created IS 'Datetime the record was created in the database.';

/**
 * Function:    rr.roles_to_features_create
 * Author:      Joshua Gray
 * Description: Function to create a record in the roles_to_features table.
 * Parameters:  role_id UUID - 
 *              feature_id UUID - 
 * Usage:       SELECT * FROM rr.roles_to_features_create('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was created.
 */
CREATE OR REPLACE FUNCTION rr.roles_to_features_create (
    role_id    UUID,
    feature_id UUID
)
    RETURNS  SETOF rr.roles_to_features
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    INSERT
    INTO   rr.roles_to_features (role_id, feature_id)
    VALUES ($1, $2)
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.roles_to_features_create IS 'Function to create a record in the roles_to_features table.';

/**
 * Function:    rr.roles_to_features_read_by_role_id
 * Author:      Joshua Gray
 * Description: Function to read all roles_to_features link records by role_id.
 * Parameters:  role_id UUID
 * Usage:       SELECT * FROM rr.roles_to_features_read_by_role_id('00000000-0000-0000-0000-000000000000');
 * Returns:     The roles_to_features link records if found.
 */
CREATE OR REPLACE FUNCTION rr.roles_to_features_read_by_role_id (
    role_id UUID
)
    RETURNS  SETOF rr.roles_to_features
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    SELECT *
    FROM   rr.roles_to_features
    WHERE  rr.roles_to_features.role_id = $1;
END;
$$;
COMMENT ON FUNCTION rr.roles_to_features_read_by_role_id IS 'Function to read all roles_to_features link records by role_id.';

/**
 * Function:    rr.roles_to_features_delete
 * Author:      Joshua Gray
 * Description: Function to delete a record in the roles_to_features table (hard delete).
 * Parameters:  role_id UUID - 
 *              feature_id UUID - 
 * Usage:       SELECT * FROM rr.roles_to_features_delete('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');
 * Returns:     The record that was deleted.
 */
CREATE OR REPLACE FUNCTION rr.roles_to_features_delete (
    role_id    UUID,
    feature_id UUID
)
    RETURNS  SETOF rr.roles_to_features
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    RETURN QUERY
    DELETE
    FROM  rr.roles_to_features
    WHERE rr.roles_to_features.role_id = $1
    AND   rr.roles_to_features.feature_id = $2
    RETURNING *;
END;
$$;
COMMENT ON FUNCTION rr.roles_to_features_delete IS 'Function to delete a record in the roles_to_features table (hard delete).';
