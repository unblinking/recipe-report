/**
 * The index created by create-react-app.
 * This file is required to be here at all times.
 * We have added react-router-dom's BrowserRouter at this level.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/nothingworksright/recipe-report}
 *
 * Recipe.Report Web App is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report Web App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import 'Index.module.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import packageJson from '../package.json'
import { store } from './app/store'
import { App } from './components/app/App'

// I added this totally superfluous graffiti for the browser console.
// Yes, importing the whole package.json to show the version. This project is
// "free and open" already (GNU AGPLv3), so the source code is readily
// available, there is no top-secret info is being leaked by doing this.

const graffiti: string = `
   ____           _                
  |  _ \\ ___  ___(_)_ __   ___     
  | |_) / _ \\/ __| | '_ \\ / _ \\    
  |  _ <  __/ (__| | |_) |  __/    
  |_|_\\_\\___|\\___|_| .__/ \\___|    
  |  _ \\ ___ _ __  |_|_  _ _| |_   
  | |_) / _ \\ '_ \\ / _ \\| '_| __|  
  |  _ <  __/ |_) | (_) | | | |_   
  |_| \\_\\___| .__/ \\___/|_|  \\__|  
  Web       |_|     version ${packageJson.version}  
                                   
`
console.log('%c' + graffiti, 'color: #0f0; background-color: #222; font-weight: bold;')

const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
