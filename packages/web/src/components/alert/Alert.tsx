/**
 * Alert div component.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/unblinking/recipe-report}
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
import styles from '../../components/alert/Alert.module.css'
import icons from '../../components/alert/AlertIcon.module.css'

export const alertStyles = {
  PRIMARY: `primary`,
  SECONDARY: `secondary`,
  SUCCESS: `success`,
  ERROR: `error`,
  WARNING: `warning`,
  INFO: `info`,
  LIGHT: `light`,
  DARK: `dark`,
  SPIN: `spin`,
} as const
type alertStylesType = typeof alertStyles
export type alertStylesKeyType = keyof alertStylesType
export type alertStylesValueType = alertStylesType[keyof alertStylesType]

interface AlertProps {
  style: alertStylesValueType
  title?: string
  message?: string | undefined
  code?: string | undefined
}

export function Alert({ style, title, message, code }: AlertProps): JSX.Element {
  return (
    <div className={styles[style]}>
      {title && (
        <span className={styles['title']}>
          <span className={icons[style]}></span> {title}
        </span>
      )}
      {message && <span className={styles['message']}>{message}</span>}
      {code && <span className={styles['code']}>Code: {code}</span>}
    </div>
  )
}
