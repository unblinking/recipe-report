# Recipe.Report  

![logo](https://user-images.githubusercontent.com/2879801/154334825-d5c4873c-0f43-42a7-a5a8-74a1d38163d3.svg)  

This is the monorepo for all recipe.report packages.  

[![codecov](https://codecov.io/gh/unblinking/recipe-report/branch/main/graph/badge.svg?token=ARrGqDcKhD)](https://codecov.io/gh/unblinking/recipe-report)  

## Backend  

Written using [Node.js](https://nodejs.org/)/[Express.js](https://expressjs.com/)/[Inversify.js](https://inversify.io/)/[TypeScript](https://www.typescriptlang.org/), following the [Domain-Driven Design](https://khalilstemmler.com/articles/domain-driven-design-intro/) approach.  

The API server is broken up into a multilayered architechture that implements a service/repository pattern. The API layer, the service layer, the business/domain layer, and the data access layer (repositories implemented through the unit-of-work pattern).  

Data is persisted using [PostgreSQL](https://www.postgresql.org/), without an ORM. Connection to the database is made through the [pg](https://github.com/brianc/node-postgres) library, and all access to data happens via parameterized [stored functions](https://www.postgresql.org/docs/current/xfunc.html). The database owner and the database app user are separate, with proper access levels.  

### Env vars  

The following environment variables (showing development values here) provide an example of the environment variables required in production. Environment variables may be set in the `/etc/environment` file on a Linux host system:  

```bash
export NODE_ENV="development"
export RR_PORT="1138"
export RR_CRYPTO_KEY="MqSm0P5dMgFSZhEBKpCv4dVKgDrsgrmT"
export RR_CRYPTO_ALGO="aes-256-cbc"
export RR_CRYPTO_IV_LENGTH="16"
export RR_JWT_SECRET="devTestEnvironment"
export RRDB_USER="dbuser"
export RRDB_OWNER="dbowner"
export RRDB_HOST="localhost"
export RRDB_DATABASE="recipedb"
export RRDB_PASSWORD="dbpass"
export RRDB_PORT="15432"
export RRDB_URL="jdbc:postgresql://localhost:15432/recipedb"
export RRDB_MIGRATIONS="filesystem:./migrations"
export RR_LOG_TARGETS="trace.log+%json,stdout:warn%simple"
```

### Development  

Prepare the development database, install dependencies, and then start the API server.  

#### Database  

Prepare a development copy of the Recipe.Report database.  

[HashiCorp Vagrant](https://www.vagrantup.com/) is used to make setting up a development database quick and easy. [Download](https://www.vagrantup.com/downloads) and [install Vagrant](https://learn.hashicorp.com/tutorials/vagrant/getting-started-install?in=vagrant/getting-started).  

From the data package directory (recipe-report/packages/data/), run the `vagrant up` command to create and configure a [Vagrant](https://www.vagrantup.com/intro) VM running PostgreSQL. Once the development database is running, run the `npm run flyway` command to download [Flyway](https://flywaydb.org/documentation/). Next, run the `npm run migrate` command to apply [database migrations](recipe-report/packages/data/migrations).  

```bash
cd ~/recipe-report/packages/data
vagrant up
npm run flyway
npm run migrate
```

#### Install  

The Recipe.Report packages are organized into a monorepo. Install dependencies from the root directory (~/recipe-report/).  

```bash
cd ~/recipe-report
npm install
```

#### Style, linting, updates  

Run these commands from the api package directory (~/recipe-report/packages/api/).  

Run the `npm run prettier` command to format the source code using the [Prettier](https://prettier.io/docs/en/index.html) opinionated styling. Run the `npm run linter` command to identify and report [ESLint](https://eslint.org/docs/user-guide/getting-started) code pattern findings. These can also be run automatically as IDE extensions.  

Run the `npm run updates` command to check for dependency updates.  

```bash
cd ~/recipe-report/packages/api
npm run prettier
npm run linter
npm run updates
```

#### Start the API server  

Run these commands from the api package directory (~/recipe-report/packages/api/).  

When you're ready to see it in action, run the `npm run develop` command to start the Recipe.Report API Server in development mode. This will run both the `npm run build` command to [compile](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#tsc-the-typescript-compiler) the TypeScript into plain JavaScript, and the `npm run start` command to run that compiled JavaScript.  

```bash
npm run develop
```

### API Endpoints  

#### User  

Users can register, activate, and then access the application. Users are linked to accounts with roles.  

In the `rr.users_to_roles` table, a record links a user, a role, and an account.  

User passwords must pass minimum complexity according to [zxcvbn](https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation).  

#### Account  

Accounts have a primary user contact, in addition to users who are linked to accounts with roles.  

Most data, such as Recipes, belong to accounts.  

#### Role  

Roles establish a level of access to an account.  

Example roles:  

Name|Description|Level
--|--|--
Kitchen Porter|Basic food preparation (newbie)|1
Commis Chef|Absorbing food knowledge (beginner)|2
Chef de Partie|Cooking the food (intermediate)|3
Sous Chef|In charge of the food (experienced)|4
Chef de Cuisine|Control all aspects of the food (expert)|5
Executive Chef|Manage the kitchen and staff (admin)|6

#### Feature  

Features are accessible to users based on account roles. For example, all users with any role/level for an account can access the recipe list feature for that account. Other features might only be accessible by users with a role/level 3 and above for an account, or only by level 6, etc.  

### Production  

Instructions for setting up a production environment for the Recipe.Report API are outside of the scope of this readme document. Currently the production API instance runs [Debian Linux](https://www.debian.org/), uses [Uncomplicated Firewall](https://wiki.debian.org/Uncomplicated%20Firewall%20%28ufw%29), uses [Nginx](https://www.nginx.com/) as a reverse proxy, and manages the Node.js process for the API using the [PM2 process manager](https://pm2.keymetrics.io/). Domain DNS is pointed to Cloudflare and Nginx is configured to require [authenticated origin pulls](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/). Deployments happen through [GitHub Actions](https://github.com/features/actions).  

## Frontend  

Written using [Node.js](https://nodejs.org/)/[React](https://reactjs.org/)/[Redux](https://redux.js.org/)/[Thunk](https://github.com/reduxjs/redux-thunk)/[TypeScript](https://www.typescriptlang.org/), using [React Hooks](https://reactjs.org/docs/hooks-overview.html).  

You can find information on [how to use TypeScript with Redux Toolkit](https://redux.js.org/tutorials/typescript-quick-start).  

### Development  

Install dependencies, and then start the React development server.  

#### Install  

The Recipe.Report packages are organized into a monorepo. Install dependencies from the root directory (~/recipe-report/).  

```bash
cd ~/recipe-report
npm install
```

#### Style, linting, updates  

Run these commands from the web package directory (~/recipe-report/packages/web/).  

Run the `npm run prettier` command to format the source code using the [Prettier](https://prettier.io/docs/en/index.html) opinionated styling. Run the `npm run linter` command to identify and report [ESLint](https://eslint.org/docs/user-guide/getting-started) code pattern findings. These can also be run automatically as IDE extensions.  

Run the `npm run updates` command to check for dependency updates.  

```bash
cd ~/recipe-report/packages/web
npm run prettier
npm run linter
npm run updates
```

#### Start the React app  

Run these commands from the web package directory (~/recipe-report/packages/web/).  

When you're ready to see it in action, run the `npm run develop` command to start the Recipe.Report React app in development mode. This will run the `npm run build` command which runs both the [`less-watch-compiler`](https://github.com/jonycheung/deadsimple-less-watch-compiler) command and the [`react-scripts start`](https://create-react-app.dev/docs/available-scripts/#npm-start) command, 

```bash
cd ~/recipe-report/packages/web
npm run develop
```

### Tips  

#### React developer tools  

In the browser, install the React Developer Tools extension. [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/). [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil).  

Once that is installed, you can view the Redux store while debugging in the browser inspector.

First, select a component in the React developer tools Components tab, and then go to the browser console and type `$r` to access the instance of that React component. To see that component's Redux store try `$r.props.store.getState()`.  

There is also Profiler tab to assist with optimizing performance.  

### Production  

Instructions for setting up a production environment for the Recipe.Report React app are outside of the scope of this readme document. Currently the production React app instance runs [Debian Linux](https://www.debian.org/), uses [Uncomplicated Firewall](https://wiki.debian.org/Uncomplicated%20Firewall%20%28ufw%29), and uses [Nginx](https://www.nginx.com/) as a web server. DNS is pointed to Cloudflare and Nginx is configured to require [authenticated origin pulls](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/). Deployments happen through [GitHub Actions](https://github.com/features/actions).  

## Testing  

Run the `npm t` command to run [Jest](https://jestjs.io/docs/getting-started) unit tests and create test coverage reports.  
