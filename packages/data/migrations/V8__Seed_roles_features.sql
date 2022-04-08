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
 * Version:     V8
 * Author:      Joshua Gray
 * Description: Seed data into the database for some roles and features.
 ******************************************************************************/

/**
 * Function:    rr.seed_roles
 * Author:      Joshua Gray
 * Description: Function to seed some database records for roles.
 * Usage:       SELECT * FROM rr.seed_roles();
 * Returns:     void.
 */
CREATE OR REPLACE FUNCTION rr.seed_roles ()
    RETURNS  void
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    INSERT INTO rr.roles (name, description, level) VALUES ('Kitchen Porter',  'Basic food preparation (newbie).',          1);
    INSERT INTO rr.roles (name, description, level) VALUES ('Commis Chef',     'Absorbing food knowledge (beginner).',      2);
    INSERT INTO rr.roles (name, description, level) VALUES ('Chef de Partie',  'Cooking the food (intermediate).',          3);
    INSERT INTO rr.roles (name, description, level) VALUES ('Sous Chef',       'In charge of the food (experienced).',      4);
    INSERT INTO rr.roles (name, description, level) VALUES ('Chef de Cuisine', 'Control all aspects of the food (expert).', 5);
    INSERT INTO rr.roles (name, description, level) VALUES ('Executive Chef',  'Manage the kitchen and staff (admin).',     6);
END;
$$;
COMMENT ON FUNCTION rr.seed_roles IS 'Function to seed some database records for roles.';

/**
 * Function:    rr.seed_features
 * Author:      Joshua Gray
 * Description: Function to seed some database records for features.
 * Usage:       SELECT * FROM rr.seed_features();
 * Returns:     void.
 */
CREATE OR REPLACE FUNCTION rr.seed_features ()
    RETURNS  void
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    INSERT INTO rr.features (name, description) VALUES ('Recipe List', 'A list of recipes.');
END;
$$;
COMMENT ON FUNCTION rr.seed_features IS 'Function to seed some database records for features.';

/**
 * Function:    rr.seed_roles_to_features
 * Author:      Joshua Gray
 * Description: Function to seed some database records for roles_to_features links.
 * Usage:       SELECT * FROM rr.seed_roles_to_features();
 * Returns:     void.
 */
CREATE OR REPLACE FUNCTION rr.seed_roles_to_features ()
    RETURNS  void
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    -- This will give the Recipe List feature to all roles
    INSERT INTO rr.roles_to_features (role_id, feature_id)
    SELECT roles.id, features.id
    FROM rr.roles roles, rr.features features -- This is a cross join
    WHERE roles.level > 0
        AND features.name = 'Recipe List';
END;
$$;
COMMENT ON FUNCTION rr.seed_roles_to_features IS 'Function to seed some database records for roles_to_features links.';

SELECT * FROM rr.seed_roles();
SELECT * FROM rr.seed_features();
SELECT * FROM rr.seed_roles_to_features();
