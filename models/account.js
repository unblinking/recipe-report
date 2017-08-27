#!/usr/bin/env node

'use strict'

/**
 * The user account model.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Modules that will be used.
 * @see {@link https://github.com/Automattic/mongoose mongoose}
 * @see {@link https://github.com/saintedlama/passport-local-mongoose passport-local-mongoose}
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

/**
 * Define the schema.
 *
 * Passport-Local Mongoose will add a username, hash and salt field to store the
 * username, the hashed password and the salt value. Because these fields will
 * be added automatically, we do not need to add any fields here manually.
 *
 * @see {@link https://github.com/saintedlama/passport-local-mongoose#usage}
 */
const Account = new Schema({}, {
  timestamps: true
})

/**
 * Plugin Passport-Local Mongoose into the schema.
 */
const options = {
  usernameField: 'email',
  usernameLowerCase: true,
  usernameQueryFields: ['email'],
  limitAttempts: true,
  MissingPasswordError: 'No password was given',
  AttemptTooSoonError: 'Account is currently locked. Try again later',
  TooManyAttemptsError: 'Account locked due to too many failed login attempts',
  NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
  IncorrectPasswordError: 'Password or username are incorrect',
  IncorrectUsernameError: 'Password or username are incorrect',
  MissingUsernameError: 'No username was given',
  UserExistsError: 'A user with the given username is already registered'
}
Account.plugin(passportLocalMongoose, options)

module.exports = mongoose.model('Account', Account)
