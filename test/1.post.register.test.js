#!/usr/bin/env node

/**
 * Test the registration route.
 * @namespace testRegistration
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/visionmedia/supertest supertest}
 * @see {@link https://github.com/shouldjs/should.js should}
 */
const request = require('supertest');
const should = require('should');

/**
 * Mocha requires.
 * @see {@link https://mochajs.org/#require mochajs require}
 */
const describe = require("mocha").describe;
const it = require("mocha").it;

/**
 * Require the local modules that will be used.
 */
const app = require('../app');

process.env.NODE_ENV = 'test';

describe('POST /register', function () {
  it('should respond with the JSON object { status : "success" } when email and password are sent with a POST request',
    function (done) {
      process.env.MOCHA_USERNAME = "no-reply" + "+" + new Date().getTime() + "@grocereport.com";
      process.env.MOCHA_PASSWORD = new Date().getTime(); // A new password
      request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.MOCHA_USERNAME,
          password: process.env.MOCHA_PASSWORD
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err)
            return done(err);
          res
            .body
            .status
            .should
            .equal("success");
          done();
        });
    });
});
