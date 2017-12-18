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

describe(`Datastore operations`, () => {
  before(async () => {
    await datastores.disconnect()
    mongo.connection.readyState.should.equal(0) // readyState of 0 (disconnected)
  })
  it(`should fail to connect to the datastore when the MongoDB URI environmental
      variable is not set.`,
    async () => {
      let unhook = intercept(txt => { return `` }) // Begin muting stdout.
      try {
        delete process.env.MONGODB_URI
        await datastores.connect()
      } catch (err) {
        err.name.should.equal(`MongoError`)
        err.message.should.equal(`failed to connect to server [undefined:27017] on first connect [MongoError: getaddrinfo ENOTFOUND undefined undefined:27017]`)
      }
      unhook() // Stop muting stdout.
    }
  )
  it(`should fail to connect to the datastore when the MongoDB URI is incomplete.`,
    async () => {
      let unhook = intercept(txt => { return `` }) // Begin muting stdout.
      try {
        process.env.MONGODB_URI = `mongodb://`
        await datastores.connect()
      } catch (err) {
        err.name.should.equal(`Error`)
        err.message.should.equal(`Invalid mongodb uri "mongodb://". Missing hostname`)
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
  after(async () => {
    await datastores.disconnect()
    delete process.env.MONGODB_URI
    mongo.connection.readyState.should.equal(0) // readyState of 0 (disconnected)
  })
})
