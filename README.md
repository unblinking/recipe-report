# 🗃 Recipe.Report API Server  

This is the [source code repository](https://github.com/nothingworksright/api.recipe.report) for the Recipe.Report API Server.  

[![codecov](https://codecov.io/gh/nothingworksright/api.recipe.report/branch/main/graph/badge.svg?token=ARrGqDcKhD)](https://codecov.io/gh/nothingworksright/api.recipe.report)  

---  

## Start Recipe.Report API Server in development mode  

First, prepare a development copy of the Recipe.Report database. Run the `vagrant up` command to create and configure a [Vagrant](https://www.vagrantup.com/intro) VM running PostgreSQL. Run the `yarn run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Run the `yarn run migratedev` command to apply [database migrations](https://github.com/nothingworksright/api.recipe.report/tree/main/src/db/migrations).

```bash
vagrant up
yarn run flyway
yarn run migratedev
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

Set an environment variable for `FLYWAY_URL` with the database connection string. See the `.env.dev` development mode file for the development example of this environment variable. Run the `yarn run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Run the `yarn run migrateprod` command to apply [database migrations](https://github.com/nothingworksright/api.recipe.report/tree/main/src/db/migrations).

Set all of the remaining required environment vars for production. See the `.env.dev` development mode file for the required environment variable names. For MailerSend integration, also set the `MAILER_SEND_KEY` environment variable to hold a valid production API token.

Once the Recipe.Report API Server has been deployed to the production environment, run the `yarn run start` command to start the Recipe.Report API Server in production mode. This will set `NODE_ENV` to production and then run the compiled JavaScript.

```bash
yarn run start
```
