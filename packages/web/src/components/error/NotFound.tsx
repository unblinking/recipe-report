/**
 * NotFound component.
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
import styles from 'components/error/Error.module.css'

/**
 * NotFound page similar to a HTTP Status 404 error.
 * @returns The NotFound component.
 */
export function NotFound(): JSX.Element {
  return (
    <div className={styles['error']}>
      <h1>Four, oh four!</h1>
      This is a "soft 404". The page could not be found. I know this isn't ideal, but at least it
      wasn't an actual 404 error. Perhaps the page has moved? Please contact support if you need
      some help.
    </div>
  )
}
