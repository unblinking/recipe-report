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
 * Require the local modules that will be used.
 * @var {object} account The MongoDB account model
 */
var accountModel = require("../models/account");

var account = {

  register: function (bundle, callback) {
    accountModel.register(new accountModel({
      email: bundle.email
    }), bundle.password, function (err, account) {
      bundle.account = account;
      callback(err, bundle);
    });
  },

};

module.exports = account;