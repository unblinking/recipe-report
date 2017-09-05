#!/usr/bin/env node

'use strict'

/**
 * The account model.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const mongo = require(`mongoose`)
mongo.Promise = global.Promise
const Schema = mongo.Schema
const passportLocalMongoose = require(`passport-local-mongoose`)

/**
 * The schema.
 * Passport-Local Mongoose will add a username, hash and salt field to store the
 * username, the hashed password, and the salt value. Later, options set the
 * username field to 'email'.
 * @see {@link https://github.com/saintedlama/passport-local-mongoose#usage}
 */
const Account = new Schema({
  nickname: { type: String, default: `nickname` },
  activated: { type: Boolean, default: false }
}, {
  timestamps: true
})

/**
 * Plug passport-local-mongoose into the schema.
 */
const options = {
  usernameField: `email`,
  usernameLowerCase: true,
  usernameQueryFields: [`email`],
  limitAttempts: true,
  errorMessages: {
    MissingPasswordError: `No password was given.`,
    AttemptTooSoonError: `Account is currently locked. Try again later.`,
    TooManyAttemptsError: `Account locked due to too many failed login attempts.`,
    NoSaltValueStoredError: `Authentication not possible. No salt value stored.`,
    IncorrectPasswordError: `Password or email address are incorrect.`,
    IncorrectUsernameError: `Password or email address are incorrect.`,
    MissingUsernameError: `No email address was given.`,
    UserExistsError: `An account with the given email address is already registered.`
  }
}
Account.plugin(passportLocalMongoose, options)

module.exports = mongo.model(`Account`, Account)
