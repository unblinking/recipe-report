# 🗃 Recipe.Report API Server  

This is the [source code repository](https://github.com/nothingworksright/api.recipe.report) for the Recipe.Report API Server.  

[![codecov](https://codecov.io/gh/nothingworksright/api.recipe.report/branch/main/graph/badge.svg?token=ARrGqDcKhD)](https://codecov.io/gh/nothingworksright/api.recipe.report)  

---  

## Start Recipe.Report API Server in development mode:  

First, prepare a development copy of the Recipe.Report database. Run the `vagrant up` command to create and configure a [Vagrant](https://www.vagrantup.com/intro) VM running PostgreSQL. Run the `yarn run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Run the `yarn run migrate` command to apply [database migrations](https://github.com/nothingworksright/api.recipe.report/tree/main/src/db/migrations).

```bash
vagrant up
yarn run flyway
yarn run migrate
```

Next, prepare and build the source code. Run the `yarn run prettier` command to format the source code using the [Prettier](https://prettier.io/docs/en/index.html) opinionated styling. Run the `yarn run linter` command to identify and report [ESLint](https://eslint.org/docs/user-guide/getting-started) code pattern findings. Run the `yarn run test` command to check for dependency updates, run [Jest](https://jestjs.io/docs/getting-started) unit tests, and create coverage reports. Run the `yarn run build` command to [compile](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#tsc-the-typescript-compiler) the TypeScript into plain JavaScript, and generate the [Typedoc](http://typedoc.org/guides/installation/#command-line-interface) [documentation](https://www.nothingworksright.io/api.recipe.report/).

```bash
yarn run prettier
yarn run linter
yarn run test
yarn run build
```

Finally, run the `yarn run develop` command to start the Recipe.Report API Server in development mode.

```bash
yarn run develop
```

## Start Recipe.Report API Server in production mode:  

```bash
yarn run start
```

