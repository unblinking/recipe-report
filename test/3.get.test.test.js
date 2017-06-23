#!/usr/bin/env node

/**
 * Test the token-validation-test route.
 * @namespace testTest
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
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
 * Require the local modules that will be used.
 */
const app = require('../app');

/**
 * Test configuration.
 */
process.env.NODE_ENV = 'test';
const agent = request.agent(app);

/**
 * Test.
 */
describe('GET /test', function () {
  it('should respond with the JSON object { status : "success" } when a valid token is sent with a GET request',
    function (done) {
      request(app)
        .get('/test')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('token', process.env.MOCHA_TOKEN)
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
