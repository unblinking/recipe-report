/**
 * Dashboard component.
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
import { Helmet } from 'react-helmet'

import styles from 'components/dashboard/Dashboard.module.css'

/**
 * Landing page and dashboard for an authenticated user.
 * @returns The Dashboard component.
 */
export function Dashboard(): JSX.Element {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Dashboard - Recipe.Report</title>
        <link rel='canonical' href='https://my.recipe.report' />
      </Helmet>
      <div className={styles['container']}>
        <h1>Welcome to my.Recipe.Report</h1>
        <p>
          Recipe.Report is an alpha open-source project that will be available soon. Please check
          back later for new features to become available.
        </p>
      </div>
    </div>
  )
}
