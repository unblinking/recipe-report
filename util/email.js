#!/usr/bin/env node

/**
 * Email related utilities for the Grocereport API server.
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
 * @see {@link https://github.com/guileen/node-sendmail node-sendmail}
 */
const sendmail = require("sendmail")({
  silent: true
});

const email = {

  looksOk: function (bundle, callback) {
    // A regular expression to do a quick sanity-check on a given email address.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let err = null;
    if (!regex.test(bundle.email)) err = "Email address seems invalid.";
    callback(err, bundle);
  },

  activationLink: function (bundle, callback) {
    const from = "no-reply@grocereport.com";
    let text = `Hello ${bundle.email},\n\nThank you for registering with Grocereport. You may login after completing activation. Please follow this link to activate your new account: \n\nhttps://api.grocereport.com/activate/${bundle.token} \n\nYou received this email because you (or someone else) used this email address to create a new account.\n\nRequest headers: ${JSON.stringify(bundle.headers, null, '\t')}\n\nThank you,\n\nhttp://www.Grocereport.com`;
    const subject = "Welcome to Grocereport. Activation is required";
    // Only send email in production.
    if (process.env.NODE_ENV == "production") {
      sendmail({
        from: from,
        to: email,
        subject: subject,
        text: text
      }, function (err, reply) {
        callback(err, bundle);
      });
    } else { // Not production, do not send email.
      // Log local link to console for debugging, then do the callback.
      //console.log(`http://localhost:1138/activate/${bundle.token}`);
      callback(null, bundle);
    }
  }

};

module.exports = email;
