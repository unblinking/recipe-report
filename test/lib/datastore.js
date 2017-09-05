#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the .
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const datastore = require(`../../lib/datastore`)

describe(`Account management wrapper functions.`, () => {
  it(`should connect to the datastore.`,
    async () => {
      await datastore.connect()
    }
  )
})
