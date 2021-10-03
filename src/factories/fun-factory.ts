/**
 * Fun.
 * Playful frivolity.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { logger } from '../wrappers/log'

const version: string = process.env.npm_package_version as string
const stage: string = `Alpha`
const mode: string = (process.env.NODE_ENV as string) || `development`
const license: string = process.env.npm_package_license as string
const repository: string = `https://github.com/nothingworksright/api.recipe.report`

const piece: string = `\x1b[1m\x1b[32m
  ____           _
 |  _ \\ ___  ___(_)_ __   ___
 | |_) / _ \\/ __| | '_ \\ / _ \\
 |  _ <  __/ (__| | |_) |  __/
 |_|_\\_\\___|\\___|_| .__/ \\___|
 |  _ \\ ___ _ __  |_|_  _ __| |_
 | |_) / _ \\ '_ \\ / _ \\| '__| __|
 |  _ <  __/ |_) | (_) | |  | |_
 |_| \\_\\___| .__/ \\___/|_|   \\__|
           |_|      \x1b[37mversion ${version}
 
 Release is ${stage}
 Running in ${mode} mode
 License ${license}
 Repository ${repository}
 \x1b[0m`

export const graffiti = logger.wrap(function graffiti(): void {
  logger.info(piece)
})
