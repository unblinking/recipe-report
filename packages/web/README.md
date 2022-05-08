# my.Recipe.Report, the Web App  

![logo](https://user-images.githubusercontent.com/2879801/154334825-d5c4873c-0f43-42a7-a5a8-74a1d38163d3.svg)  

This is the [source code repository](https://github.com/nothingworksright/recipe-report/tree/main/packages/web) for the Recipe.Report Web App.

Written using [Node.js](https://nodejs.org/)/[React](https://reactjs.org/)/[Redux](https://redux.js.org/)/[Thunk](https://github.com/reduxjs/redux-thunk)/[TypeScript](https://www.typescriptlang.org/), using [React Hooks](https://reactjs.org/docs/hooks-overview.html).  

You can find information on [how to use TypeScript with Redux Toolkit](https://redux.js.org/tutorials/typescript-quick-start).  

## Development  

### Install  

The Recipe.Report packages are organized into a monorepo. Install dependencies from the root directory (~/recipe-report/).  

```bash
cd ~/recipe-report
npm install
```

### Web App  

Run the remaining commands from the web package directory (~/recipe-report/packages/web/).  

Run the `npm run prettier` command to format the source code using the [Prettier](https://prettier.io/docs/en/index.html) opinionated styling. Run the `npm run linter` command to identify and report [ESLint](https://eslint.org/docs/user-guide/getting-started) code pattern findings. These can also be run automatically as IDE extensions.  

Run the `npm run updates` command to check for dependency updates.  

```bash
cd ~/recipe-report/packages/web
npm run prettier
npm run linter
npm run updates
```

When you're ready to see it in action, run the `npm run develop` command to start the Recipe.Report Web App in development mode. This will run the `npm run build` command which runs both the [`less-watch-compiler`](https://github.com/jonycheung/deadsimple-less-watch-compiler) command and the [`react-scripts start`](https://create-react-app.dev/docs/available-scripts/#npm-start) command, 

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

## Production  

Instructions for setting up a production environment for the Recipe.Report Web App are outside of the scope of this readme document. Currently the production Web App instance runs [Debian Linux](https://www.debian.org/), uses [Uncomplicated Firewall](https://wiki.debian.org/Uncomplicated%20Firewall%20%28ufw%29), and uses [Nginx](https://www.nginx.com/) as a web server. DNS is pointed to Cloudflare and Nginx is configured to require [authenticated origin pulls](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/). Deployments happen through [GitHub Actions](https://github.com/features/actions).  
