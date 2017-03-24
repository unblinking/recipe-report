#!/usr/bin/env node

/**
 * Response related utilities for the Grocereport API server.
 * @namespace utilities
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

const respond = {

  err: function (res, err) {
    res
      .status(200)
      .json({
        "status": "error",
        "err": err
      });
  },

  success: function (res, message, json) {
    res
      .status(200)
      .json({
        "status": "success",
        "message": message,
        "json": json
      });
  }

};

module.exports = respond;