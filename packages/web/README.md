# my.Recipe.Report, the Web App  

![logo](https://user-images.githubusercontent.com/2879801/154334825-d5c4873c-0f43-42a7-a5a8-74a1d38163d3.svg)

This is the [source code](https://github.com/nothingworksright/recipe-report/tree/main/packages/web) for the official Recipe.Report Web App.

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
