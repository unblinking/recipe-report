#!/usr/bin/env node

'use strict'

/**
 * Datastore wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const mongo = require(`mongoose`)

/**
 * Connect to the datastore
 */
function connect () {
  return new Promise(resolve => {
    mongo.Promise = global.Promise
    mongo.connect(process.env.MONGODB_URI, {useMongoClient: true})
    mongo.connection.once(`connected`, resolve)
  })
}

module.exports = {
  connect: connect
}
