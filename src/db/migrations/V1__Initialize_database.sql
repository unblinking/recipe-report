/**
 * Initial database migration for Recipe.Report.
 * @author {@link https://github.com/jmg1138 jmg1138}
 * 
 * Using PostgreSQL for database.
 * @see {@link https://www.postgresql.org/ PostgreSQL}
 * 
 * Using Flyway for database migrations.
 * @see {@link https://flywaydb.org/documentation/database/postgresql Flyway}
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
  _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  _username VARCHAR (50) UNIQUE NOT NULL,
  _password TEXT NOT NULL,
  _email TEXT UNIQUE NOT NULL,
  _date_created TIMESTAMPTZ NOT NULL,
  _date_last_login TIMESTAMPTZ,
  _date_deleted TIMESTAMPTZ
);
COMMENT ON TABLE users IS 'Individual user records including login credentials.';
COMMENT ON COLUMN users._id IS 'UUID/GUID primary key of the user record.';
COMMENT ON COLUMN users._username IS 'Unique user display name.';
COMMENT ON COLUMN users._password IS 'Encrypted user password using the pgcrypto crypt function, and  gen_salt with the blowfish algorithm and iteration count of 8.';
COMMENT ON COLUMN users._email IS 'Unique email address for the user.';
COMMENT ON COLUMN users._date_created IS 'The datetime when the user record was created in the database.';
COMMENT ON COLUMN users._date_last_login IS 'The datetime when the user last logged into the system successfully.';
COMMENT ON COLUMN users._date_deleted IS 'Soft delete datetime when the user was marked as deleted.';
