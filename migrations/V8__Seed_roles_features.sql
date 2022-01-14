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
    RETURNS void
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    role_id_1 UUID;
    role_id_2 UUID;
    role_id_3 UUID;
    role_id_4 UUID;
    role_id_5 UUID;
    role_id_6 UUID;
BEGIN
    SELECT gen_random_uuid() INTO role_id_1;
    SELECT gen_random_uuid() INTO role_id_2;
    SELECT gen_random_uuid() INTO role_id_3;
    SELECT gen_random_uuid() INTO role_id_4;
    SELECT gen_random_uuid() INTO role_id_5;
    SELECT gen_random_uuid() INTO role_id_6;

    INSERT INTO rr.roles (id, name, description, level) VALUES (role_id_1, 'Kitchen Porter',  'Basic food preparation (newbie).', 1);
    INSERT INTO rr.roles (id, name, description, level) VALUES (role_id_2, 'Commis Chef',     'Absorbing food knowledge (beginner).', 2);
    INSERT INTO rr.roles (id, name, description, level) VALUES (role_id_3, 'Chef de Partie',  'Cooking the food (intermediate).', 3);
    INSERT INTO rr.roles (id, name, description, level) VALUES (role_id_4, 'Sous Chef',       'In charge of the food (experienced).', 4);
    INSERT INTO rr.roles (id, name, description, level) VALUES (role_id_5, 'Chef de Cuisine', 'Control all aspects of the food (expert).', 5);
    INSERT INTO rr.roles (id, name, description, level) VALUES (role_id_6, 'Executive Chef',  'Manage the kitchen and staff (admin).', 6);
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
    RETURNS void
    LANGUAGE PLPGSQL
    AS
$$
DECLARE
    feature_id_1 UUID;
BEGIN
    SELECT gen_random_uuid() INTO feature_id_1;

    INSERT INTO rr.features (id, name, description) VALUES (feature_id_1, 'Recipe List', 'A list of recipes.');
END;
$$;
COMMENT ON FUNCTION rr.seed_features IS 'Function to seed some database records for features.';

SELECT * FROM rr.seed_roles();
SELECT * FROM rr.seed_features();