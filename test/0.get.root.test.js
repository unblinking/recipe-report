#!/usr/bin/env node

/**
 * Test for the Grocereport API server.
 * @namespace test
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
 * @see {@link https://github.com/visionmedia/supertest supertest}
 * @see {@link https://github.com/shouldjs/should.js should}
 */
const request = require('supertest');
const should = require('should');

/**
 * Require the local modules that will be used.
 */
const app = require('../app');

process.env.NODE_ENV = 'test';

describe('GET / (the root route)', function () {
  it('should respond with the JSON object { status : "success" }', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => res.body.status.should.equal("success"))
      .then(() => done())
      .catch(err => done(err));
      /*
      .end(function (err, res) {
        if (err) return done(err);
        res.body.status.should.equal("success");
        done();
      });
      */
  });
});
