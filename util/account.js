#!/usr/bin/env node

/**
 * Account related utilities for the Grocereport API server.
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
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 */
const P = require('bluebird');

/**
 * Require the local modules that will be used.
 */
const accountModel = require("../models/account");

function register(email, password) {
  return new P((resolve, reject) => {
    accountModel.register(new accountModel({
      email: email
    }), password, (err, account) => {
      if (err) reject(err);
      else resolve(account);
    });
  });
}
exports.register = register;
