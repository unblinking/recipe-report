#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the datastore wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const datastores = require(`../../lib/datastores`)
const intercept = require(`intercept-stdout`)
const mongo = require(`mongoose`)

describe(`Datastore wrapper functions.`, () => {
  it(`should begin with the MongoDB readyState of 0 (disconnected).`,
    async () => {
      await datastores.disconnect()
      mongo.connection.readyState.should.equal(0)
    }
  )
  it(`should fail to connect to the datastore when the URI is incomplete.`,
    async () => {
      let unhook = intercept(txt => { return `` }) // Begin muting stdout.
      try {
        process.env.MONGODB_URI = `mongodb://`
        await datastores.connect()
      } catch (err) {
        err.name.should.equal(`Error`)
        err.message.should.equal(`Invalid mongodb uri. Missing hostname`)
      }
      unhook() // Stop muting stdout.
    }
  )
  it(`should connect to the datastore without error.`,
    async () => {
      process.env.MONGODB_URI = `mongodb://127.0.0.1/test`
      await datastores.connect()
      mongo.connection.readyState.should.equal(1)
    }
  )
  it(`should not connect to the datastore when it is already connected.`,
    async () => {
      const result = await datastores.connect()
      result.should.equal(`MongoDB readyState 1`)
    }
  )
  it(`should end with the MongoDB readyState of 0 (disconnected).`,
    async () => {
      await datastores.disconnect()
      delete process.env.MONGODB_URI
      mongo.connection.readyState.should.equal(0)
    }
  )
})
