/**
 * Spacer component.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/nothingworksright/my.recipe.report}
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
interface SpacerProps {
  size: number
  axis: string
}

/**
 * A very simple and reusable spacer component.
 * Based on a blog post by Joshua Comeau
 * @see {@link https://www.joshwcomeau.com/react/modern-spacer-gif/}
 * Just a few changes here, and converted to typescript.
 */
export function Spacer({ size, axis }: SpacerProps): JSX.Element {
  const width = axis === 'vertical' ? 1 : size
  const height = axis === 'horizontal' ? 1 : size

  return (
    <span
      style={{
        display: 'block',
        width,
        minWidth: width,
        height,
        minHeight: height,
      }}
    />
  )
}
