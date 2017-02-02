#!/usr/bin/env node

/**
 * The account model.
 * @namespace account
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
 */
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

/**
 * Define the schema.
 * 
 * Passport-Local Mongoose will add a username, hash and salt field to store the
 * username, the hashed password and the salt value. Because these fields will
 * be added automatically, we do not need to add any fields here manually.
 * 
 * @see {@link https://github.com/saintedlama/passport-local-mongoose#usage}
 */
var accountSchema = new mongoose.Schema({}, { timestamps: true });

/**
 * Plugin Passport-Local Mongoose into the schema.
 */
accountSchema.plugin(passportLocalMongoose);

/**
 * Define the model.
 */
var account = mongoose.model("accounts", accountSchema);

module.exports = account;