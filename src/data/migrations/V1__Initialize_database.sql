/**
 * Initial database migration for Recipe.Report.
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

/**
 * Users table.
 *
 * id: Going with UUID. Very low probability that a UUID will be duplicated.
 *   I know, sort order issues, but so what. I won't sort on it.
 * username: Limiting to 50 characters for display purposes mostly.
 * password: Going with salted/hashed passwords using pgcrypto.
 */
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR (50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email_address TEXT UNIQUE NOT NULL,
  date_created TIMESTAMPTZ NOT NULL,
  date_activated TIMESTAMPTZ,
  date_last_login TIMESTAMPTZ,
  date_deleted TIMESTAMPTZ
);
COMMENT ON TABLE users IS 'Individual user records including login credentials.';
COMMENT ON COLUMN users.id IS 'UUID/GUID primary key of the user record.';
COMMENT ON COLUMN users.username IS 'Unique user display name.';
COMMENT ON COLUMN users.password IS 'Encrypted user password using the pgcrypto crypt function, and gen_salt with the blowfish algorithm and iteration count of 8.';
COMMENT ON COLUMN users.email_address IS 'Unique email address for the user.';
COMMENT ON COLUMN users.date_created IS 'The datetime when the user record was created in the database.';
COMMENT ON COLUMN users.date_activated IS 'The datetime when the user record was activated for login.';
COMMENT ON COLUMN users.date_last_login IS 'The datetime when the user last logged into the system successfully.';
COMMENT ON COLUMN users.date_deleted IS 'Soft delete datetime when the user was marked as deleted.';
