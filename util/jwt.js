#!/usr/bin/env node

/**
 * Wrapper functions for the JSON Web Token.
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
 * @see {@link https://github.com/petkaantonov/bluebird bluebird}
 */
const jsonwebtoken = require("jsonwebtoken");
const P = require("bluebird");

/**
 *
 */
const secret = process.env.JWT_SECRET || "testSecret";
const algorithm = process.env.JWT_ALGORITHM || "HS256";

/**
 *
 */
const jwt = {

  /**
   *
   * @param {Object}   bundle   [description]
   * @param {Function} callback [description]
   */
  /*
  sign: bundle => {
    return new P((resolve, reject) =>
      jsonwebtoken.sign({
        data: bundle.account._doc._id
      }, secret, {
        algorithm: algorithm,
        expiresIn: 172800 // Two days (in seconds)
      }, (err, token) => {
        if (err) reject(err);
        else {
          bundle.token = token;
          resolve(bundle);
        }
      })
    );
  },
  */

  sign: (bundle, callback) => {
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


  /**
   *
   * @param {Object}   bundle   [description]
   * @param {Function} callback [description]
   */
  verify: (bundle, callback) => {
    jsonwebtoken.verify(bundle.token, secret, function (err, decoded) {
      bundle.decoded = decoded;
      callback(err, bundle);
    });
  }

};

/**
 * Assign our object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = jwt;
