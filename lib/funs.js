#!/usr/bin/env node

'use strict'

/**
 * Fun functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const packageJson = require(`../package.json`)

/**
 * The application name.
 * @see {@link http://patorjk.com/software/taag/#p=display&h=2&v=2&f=Standard&t=Recipe%0AReport TAAG}
 * @see {@link https://stackoverflow.com/a/41407246 nodejs console font color}
 */
function graffiti () {
  return new Promise(resolve => {
    console.log(`\x1b[1m\x1b[32m
  ____           _
 |  _ \\ ___  ___(_)_ __   ___
 | |_) / _ \\/ __| | '_ \\ / _ \\
 |  _ <  __/ (__| | |_) |  __/
 |_|_\\_\\___|\\___|_| .__/ \\___|
 |  _ \\ ___ _ __  |_|_  _ __| |_
 | |_) / _ \\ '_ \\ / _ \\| '__| __|
 |  _ <  __/ |_) | (_) | |  | |_
 |_| \\_\\___| .__/ \\___/|_|   \\__|
           |_|     \x1b[37m version ${packageJson.version}
    \x1b[0m`)
    resolve()
  })
}
exports.graffiti = graffiti
