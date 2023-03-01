/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Navigation bar component.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import { NavLink } from 'react-router-dom'

import { useAppSelector } from '../../app/hooks'
import styles from '../../components/navbar/NavBar.module.css'
import { selectAuthenticationToken } from '../authentication/authenticationSlice'
import { Favicon } from '../logo/Favicon'

export function NavBar(): JSX.Element {
  const token = useAppSelector(selectAuthenticationToken)
  return (
    <div className={styles['container']}>
      {token && (
        <nav className={styles['nav']}>
          <div className={styles['favicon']}>
            <Favicon />
          </div>
          |
          <NavLink
            to='/'
            className={({ isActive }): any => (isActive ? styles['active'] : undefined)}
          >
            Dashboard
          </NavLink>
          |
          <NavLink
            to='/profile'
            className={({ isActive }): any => (isActive ? styles['active'] : undefined)}
          >
            Profile
          </NavLink>
          |
          <NavLink
            to='/recipe'
            className={({ isActive }): any => (isActive ? styles['active'] : undefined)}
          >
            Recipe
          </NavLink>
        </nav>
      )}
    </div>
  )
}
