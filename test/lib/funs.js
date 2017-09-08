#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of functions that put the fun in functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const funs = require(`../../lib/funs`)

describe(`Fun operations`, () => {
  it(`should return graffiti that can be logged to the console.`,
    async () => {
      const art = await funs.graffiti()
      art.should.not.equal(undefined)
    }
  )
})
