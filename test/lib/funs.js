#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of functions that put the fun in functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const funs = require(`../../lib/funs`)
const packageJson = require(`../../package.json`)

let art = `\x1b[1m\x1b[32m
  ____           _
 |  _ \\ ___  ___(_)_ __   ___
 | |_) / _ \\/ __| | '_ \\ / _ \\
 |  _ <  __/ (__| | |_) |  __/
 |_|_\\_\\___|\\___|_| .__/ \\___|
 |  _ \\ ___ _ __  |_|_  _ __| |_
 | |_) / _ \\ '_ \\ / _ \\| '__| __|
 |  _ <  __/ |_) | (_) | |  | |_
 |_| \\_\\___| .__/ \\___/|_|   \\__|
 \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${packageJson.version}
    \x1b[0m`

describe(`Fun functions.`, () => {
  it(`should return graffiti that can be logged to the console.`,
    async () => {
      const returned = await funs.graffiti()
      returned.should.equal(art)
    }
  )
})
