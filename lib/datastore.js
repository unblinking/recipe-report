#!/usr/bin/env node

'use strict'

/**
 * Datastore wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const mongo = require(`mongoose`)

/**
 * Connect to the datastore
 * The mongoose readyState values are:
 *   0 = disconnected
 *   1 = connected
 *   2 = connecting
 *   3 = disconnecting
 */
function connect () {
  mongo.Promise = global.Promise
  mongo.connection.on(`error`, err => {
    console.log(`MongoDB error: ${err.name}: ${err.message}.`)
  })
  if (mongo.connection.readyState !== 1) {
    return mongo.connect(process.env.MONGODB_URI, {useMongoClient: true})
  }
}

module.exports = {
  connect: connect
}
