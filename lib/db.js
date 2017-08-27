#!/usr/bin/env node

'use strict'

/**
 * Datastore functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 * @see {@link https://github.com/Automattic/mongoose mongoose}
 */
const mongoose = require('mongoose')

/**
 * Connect mongoose to the MongoDB datastore.
 */
async function connect () {
  try {
    const uri = process.env.MONGODB_URI
    mongoose.Promise = global.Promise
    await mongoose.connect(uri, {useMongoClient: true})
    console.log(` \x1b[1m\x1b[33m>\x1b[0m \x1b[1m\x1b[36mConnected to MongoDB datastore\x1b[0m`)
  } catch (err) {
    console.log(` \x1b[1m\x1b[33m>\x1b[0m \x1b[1m\x1b[36mError connecting to MongoDB datastore\x1b[0m`)
  }
}
exports.connect = connect
