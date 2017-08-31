#!/usr/bin/env node

'use strict'

/**
 * Express Response utilities.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Send the Express HTTP response with error information.
 * @param {Object} res HTTP res that Express sends when it gets a req.
 * @param {Error} err Error object to include with the res.
 */
function error (res, err) {
  return new Promise(resolve => {
    res.status(200).json({
      'status': 'error',
      'message': err.message,
      'json': {
        name: err.name
      }
    })
  })
}
exports.error = error

/**
 * Send the Express HTTP response with success information.
 * @param {Object} res HTTP res that Express sends when it gets a req.
 * @param {String} message Message to include with the res.
 * @param {Object} json Object to include with the res.
 */
function success (res, message, json) {
  return new Promise(resolve =>
    res.status(200).json({
      'status': 'success',
      'message': message,
      'json': json
    })
  )
}
exports.success = success
