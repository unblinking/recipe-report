#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the datastore wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const datastores = require(`../../lib/datastores`)
const mongo = require(`mongoose`)
const mute = require(`mute`)

describe(`Datastore operations`, () => {
  before(async () => {
    await datastores.disconnect()
    mongo.connection.readyState.should.equal(0) // readyState of 0 (disconnected)
  })
  it(`should fail to connect to the datastore when the MongoDB URI environmental variable is not set.`,
    async () => {
      const unmute = mute() // Begin muting stdout and stderr.
      try {
        delete process.env.MONGODB_URI
        await datastores.connect()
      } catch (err) {
        err.name.should.equal(`Error`)
        err.message.should.equal(`URL malformed, cannot be parsed`)
      }
      unmute() // Stop muting stdout and stderr.
    }
  )
  it(`should fail to connect to the datastore when the MongoDB URI is incomplete.`,
    async () => {
      const unmute = mute() // Begin muting stdout and stderr.
      try {
        process.env.MONGODB_URI = `mongodb://`
        await datastores.connect()
      } catch (err) {
        err.name.should.equal(`Error`)
        err.message.should.equal(`No hostname or hostnames provided in connection string`)
      }
      unmute() // Stop muting stdout and stderr.
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
  after(async () => {
    await datastores.disconnect()
    delete process.env.MONGODB_URI
    mongo.connection.readyState.should.equal(0) // readyState of 0 (disconnected)
  })
})
