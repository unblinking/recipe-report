#!/usr/bin/env node

'use strict'

/**
 * Expressjs response wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Send the expressjs response with error information.
 * @param {Object} res HTTP res that expressjs sends when it gets a req.
 * @param {Error} err Error object to include with the res.
 */
function error (res, err) {
  res.status(200).json({
    status: `error`,
    message: err.message,
    json: {
      name: err.name
    }
  })
}

/**
 * Send the expressjs response with success information.
 * @param {Object} res HTTP res that expressjs sends when it gets a req.
 * @param {String} message Message to include with the res.
 * @param {Object} json Object to include with the res.
 */
function success (res, message, json) {
  res.status(200).json({
    status: `success`,
    message: message,
    json: json
  })
}

module.exports = {
  error: error,
  success: success
}
