#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit test of the account management wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const accounts = require(`../../lib/accounts`)
const datastores = require(`../../lib/datastores`)
const mongo = require(`mongoose`)
const theMoment = require('moment')

describe(`Account operations`, () => {
  before(async () => {
    // Set the required environmental variables.
    process.env.TEST_ACCOUNT_USERNAME = `${new Date().getTime()}@ReCiPe.RePoRt`
    process.env.TEST_ACCOUNT_PASSWORD = new Date().getTime()
    process.env.MONGODB_URI = `mongodb://127.0.0.1/test`
    // Connect to the datastore so that accounts may be created in it.
    await datastores.connect()
    mongo.connection.readyState.should.equal(1) // readyState of 1 (connected)
  })
  it(`should fail to create (register) a new account in the datastore without an email address.`,
    async () => {
      try {
        await accounts.create(undefined, process.env.TEST_ACCOUNT_PASSWORD)
      } catch (err) {
        err.name.should.equal(`MissingUsernameError`)
        err.message.should.equal(`No email address was given.`)
      }
    }
  )
  it(`should fail to create (register) a new account in the datastore without a password.`,
    async () => {
      try {
        await accounts.create(process.env.TEST_ACCOUNT_USERNAME, undefined)
      } catch (err) {
        err.name.should.equal(`MissingPasswordError`)
        err.message.should.equal(`No password was given.`)
      }
    }
  )
  it(`should create (register) a new account in the datastore.`,
    async () => {
      const account = await accounts.create(
        process.env.TEST_ACCOUNT_USERNAME, process.env.TEST_ACCOUNT_PASSWORD
      )
      theMoment(account.updatedAt).isSame(Date.now(), `day`).should.equal(true)
      theMoment(account.createdAt).isSame(Date.now(), `day`).should.equal(true)
      account.salt.should.not.equal(undefined)
      account.hash.should.not.equal(undefined)
      account.email.should.equal(process.env.TEST_ACCOUNT_USERNAME.toLowerCase())
      theMoment(account.last).isSame(Date.now(), `day`).should.equal(true)
      account.attempts.should.equal(0)
      account._id.should.not.equal(undefined)
      account.activated.should.equal(false)
      account.nickname.should.equal(`nickname`)
    }
  )
  after(async () => {
    // Clean up the required environmental variables.
    delete process.env.TEST_ACCOUNT_USERNAME
    delete process.env.TEST_ACCOUNT_PASSWORD
    delete process.env.MONGODB_URI
    await datastores.disconnect()
    mongo.connection.readyState.should.equal(0) // readyState of 0 (disconnected)
  })
})
