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
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/auth0/node-jsonwebtoken node-jsonwebtoken}
 */
const jsonwebtoken = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "testSecret";
const algorithm = process.env.JWT_ALGORITHM || "HS256";

const jwt = {

  sign: function (bundle, callback) {
    jsonwebtoken.sign({
      data: bundle.account._doc._id
    }, secret, {
      algorithm: algorithm,
      expiresIn: 172800 // Two days (in seconds)
    }, function (err, token) {
      bundle.token = token;
      callback(err, bundle);
    });
  },

  verify: function (bundle, callback) {
    jsonwebtoken.verify(bundle.token, secret, function (err, decoded) {
      bundle.decoded = decoded;
      callback(err, bundle);
    });
  }

};

module.exports = jwt;