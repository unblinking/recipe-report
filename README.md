# 🗃 Recipe.Report API Server  

This is the [source code repository](https://github.com/nothingworksright/api.recipe.report) for the Recipe.Report API Server.  

[![codecov](https://codecov.io/gh/nothingworksright/api.recipe.report/branch/main/graph/badge.svg?token=ARrGqDcKhD)](https://codecov.io/gh/nothingworksright/api.recipe.report)  

---  

## Env vars  

The following development environment variables with development values provide an example of the environment variables required in production. Environment variable values may be set in the `/etc/environment` file on a Linux host system:  

```bash
export NODE_ENV="development"
export RR_PORT="1138"
export RR_CRYPTO_KEY="MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT"
export RR_CRYPTO_ALGO="aes-256-cbc"
export RR_CRYPTO_IV_LENGTH="16"
export RR_JWT_SECRET="devTestEnvironment"
export RRDB_USER="dbuser"
export RRDB_HOST="localhost"
export RRDB_DATABASE="recipedb"
export RRDB_PASSWORD="dbpass"
export RRDB_PORT="15432"
export RRDB_URL="jdbc:postgresql://localhost:15432/recipedb"
export RRDB_MIGRATIONS="filesystem:./migrations"
export RR_LOG_TARGETS="trace.log+%json,stdout:warn%simple"
```

## Start Recipe.Report API Server in development mode  

First, prepare a development copy of the Recipe.Report database. Run the `vagrant up` command to create and configure a [Vagrant](https://www.vagrantup.com/intro) VM running PostgreSQL. Run the `yarn run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Run the `yarn run migrate` command to apply [database migrations](https://github.com/nothingworksright/api.recipe.report/tree/main/migrations).

```bash
vagrant up
yarn run flyway
yarn run migrate
```

Optionally, to start you could prepare and build the source code. Run the `yarn run prettier` command to format the source code using the [Prettier](https://prettier.io/docs/en/index.html) opinionated styling. Run the `yarn run linter` command to identify and report [ESLint](https://eslint.org/docs/user-guide/getting-started) code pattern findings. Run the `yarn run test` command to check for dependency updates, run [Jest](https://jestjs.io/docs/getting-started) unit tests, and create coverage reports. Run the `yarn run docs` command to generate the [Typedoc](http://typedoc.org/guides/installation/#command-line-interface) [documentation](https://www.nothingworksright.io/api.recipe.report/). Run the `yarn run build` command to [compile](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#tsc-the-typescript-compiler) the TypeScript into plain JavaScript.

```bash
yarn run prettier
yarn run linter
yarn run test
yarn run build
```

When you're ready to see it in action, run the `yarn run develop` command to start the Recipe.Report API Server in development mode.

```bash
yarn run develop
```

## Start Recipe.Report API Server in production mode  

In the production environment, prepare the production PostgreSQL database installation. Once the database is ready and you can connect to it, install the `pgcrypto` extension. Using a client such as `psql` will look like this:

```sql
db=> CREATE EXTENSION pgcrypto;
CREATE EXTENSION
```

Set an environment variable for `FLYWAY_URL` with the database connection string. See the `.env.dev` development mode file for the development example of this environment variable. Run the `yarn run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Run the `yarn run migrate` command to apply [database migrations](https://github.com/nothingworksright/api.recipe.report/tree/main/migrations).

Set all of the remaining required environment vars for production. See the `.env.dev` development mode file for the required environment variable names. For MailerSend integration, also set the `MAILER_SEND_KEY` environment variable to hold a valid production API token.

Once the Recipe.Report API Server has been deployed to the production environment, run the `yarn run start` command to start the Recipe.Report API Server in production mode. This will set `NODE_ENV` to production and then run the compiled JavaScript.

```bash
yarn run start
```
