# my.Recipe.Report, the Web App

![logo](https://user-images.githubusercontent.com/2879801/154334825-d5c4873c-0f43-42a7-a5a8-74a1d38163d3.svg)

This is the [source code](https://github.com/nothingworksright/my.recipe.report) for the official Recipe.Report Web App.

Written using [React](https://reactjs.org/)/[Redux](https://redux.js.org/)/[Thunk](https://github.com/reduxjs/redux-thunk)/[TypeScript](https://www.typescriptlang.org/). You can find information on [how to use TypeScript with Redux Toolkit](https://redux.js.org/tutorials/typescript-quick-start).

## Development work

Want to do some development work?

```bash
npm install
npm run develop
```

### Helpful development tips

#### React developer tools

In the browser, install the React Developer Tools extension. [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/). [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil).

Once that is installed, you can view the Redux store while debugging in the browser inspector.

First, select a component in the React developer tools, and then go to the browser console and type `$r` to access the instance of that React component. To see that component's Redux store try `$r.props.store.getState()`.

## Production build

Want to mimic a production build?

```bash
npm install --production=true
npm run build
```

The build will be ready in the `build` directory.

## `package.json`

You can't put comments into a `package.json` file, so here are some comments that might help explain why the stuff that is in there is in there.

### `devDependencies`

In the `devDependencies` we have packages that are only needed during work in a development environment.

<!-- prettier-ignore -->
Package|Description
--|--
concurrently|Run multiple commands concurrently, better. Used in the develop script in `package.json` to run the `less-watch-compiler` and `react-scripts start`. This way any changes to `less` files are automatically compiled to `css` during development.
npm-check-updates|Heads-up when dependencies have newer versions available.
prettier|Enforce consistent code style.
@testing-library/jest-dom<br />@testing-library/react<br />@testing-library/user-event|Unit testing for React.

### `dependencies`

In the `dependencies` we have packages that could be required to build and deploy this static web site. In some continuous deployment services, the project must be able to build. Any packages that are required to complete the build are listed here.

<!-- prettier-ignore -->
Package|Description
--|--
@reduxjs/toolkit|Toolset for Redux development.
@types/|TypeScript definitions.
history|Used with `react-router-dom` to get some MPA behavior.
less|Convert `less` to `css`.
less-watch-compiler|Used in the pre-build script, and the develop script, to compile `css` from `less` files.
qs|Querystring parser used in our TypeScript wrapper around the `fetch` API, to do `qs.stringify(body)` when sending the body in POST and PUT requests.
react-dom|React package for working with the DOM.
react-hook-form|Great forms library for React Hooks.
react-redux|Official React bindings for Redux, the state container.
react-router-dom|Used to get some MPA behavior.
react-scripts|Scripts by Create React App, to simplify a lot of configuration.
redux|A Predictable State Container for JS Apps.
redux-thunk|Thunk middleware for Redux. Thunks are the recommended middleware for basic Redux side effects logic, including complex synchronous logic that needs access to the store, and simple async logic like AJAX requests.
typescript|TypeScript is JavaScript with syntax for types. Instead of `jsx` files in this React project, you will find `tsx` files. Type all the things!
