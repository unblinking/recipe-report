#!/usr/bin/env node

/**
 * JWT related utilities for the Grocereport API server.
 * @namespace utilities
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

/**
 * Require the modules that will be used.
 * @see {@link https://github.com/auth0/node-jsonwebtoken node-jsonwebtoken}
 */
var jsonwebtoken = require("jsonwebtoken");

var secret = process.env.JWT_SECRET || "testSecret";
var algorithm = process.env.JWT_ALGORITHM || "HS256";

var jwt = {

  sign: function (accountDocId, callback) {
    if (accountDocId !== null) {
      jsonwebtoken.sign({
        data: accountDocId
      }, secret, {
        algorithm: algorithm,
        expiresIn: 172800 // Two days (in seconds)
      }, function (err, token) {
        callback(err, token);
      });
    } else {
      var err = "Error signing token: No account provided.";
      callback(err, null);
    }
  },

  verify: function (token, callback) {
    if (token !== null) {
      jsonwebtoken.verify(token, secret, function (err, decoded) {
        callback(err, decoded);
      });
    } else {
      var err = "Error decoding token: No token provided.";
      callback(err, null);
    }
  }

};

module.exports = jwt;