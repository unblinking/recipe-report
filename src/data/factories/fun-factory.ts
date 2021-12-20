/**
 * Fun. Playful frivolity.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/api.recipe.report}
 *
 * Recipe.Report API Server is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report API Server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */

// import { logger } from '../wrappers/log'

const version: string = process.env.npm_package_version as string
const stage: string = `Alpha`
const mode: string = (process.env.NODE_ENV as string) || `development`
const license: string = process.env.npm_package_license as string
const repository: string = `https://github.com/nothingworksright/api.recipe.report`

const piece: string = `\x1b[1m\x1b[32m  ____           _
 |  _ \\ ___  ___(_)_ __   ___
 | |_) / _ \\/ __| | '_ \\ / _ \\
 |  _ <  __/ (__| | |_) |  __/
 |_|_\\_\\___|\\___|_| .__/ \\___|
 |  _ \\ ___ _ __  |_|_  _ __| |_
 | |_) / _ \\ '_ \\ / _ \\| '__| __|
 |  _ <  __/ |_) | (_) | |  | |_
 |_| \\_\\___| .__/ \\___/|_|   \\__|
 \x1b[37mAPI\x1b[1m\x1b[32m       |_|      \x1b[37mversion ${version}
 
 Release is ${stage}
 Running in ${mode} mode
 License ${license}
 Repository ${repository}
\x1b[0m
`

export const graffiti = (): void => {
  process.stdout.write(piece)
}
