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

var respond = {

  err: function (res, err) {
    res
      .status(200)
      .json({
        "status": "error",
        "err": err
      });
  },

  success: function (res, route, json) {
    var message = null;
    if (json === null) {
      json = {};
    }
    if (route === "root") {
      message = "This is the Grocereport API server. http://www.Grocereport.com";
    }
    if (route === "registration") {
      message = "Account registered successfully. Account activation is required before login. An activation email has been sent. Please follow the link provided in the activation email.";
    }
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