#!/usr/bin/env node

'use strict'

/**
 * Datastore wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const mongo = require(`mongoose`)

mongo.Promise = global.Promise

/**
 * Connect to the datastore
 * The mongoose readyState values are:
 *   0 = disconnected
 *   1 = connected
 *   2 = connecting
 *   3 = disconnecting
 */
function connect () {
  mongo.connection.on(`error`, err => {
    console.log(`MongoDB error: ${err.name}: ${err.message}.`)
  })
  if (mongo.connection.readyState !== 1) {
    return mongo.connect(process.env.MONGODB_URI, {useMongoClient: true})
  } else {
    return `MongoDB readyState ${mongo.connection.readyState}`
  }
}

function disconnect () {
  return mongo.disconnect()
}

module.exports = {
  connect: connect,
  disconnect: disconnect
}
