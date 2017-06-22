#!/usr/bin/env node

/**
 * Test the root route.
 * @namespace testRoot
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

describe('GET / (the root route)', () =>
  it('should respond with a JSON object and status 200.', () =>
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  )
);

describe('GET / (the root route)', () =>
  it('should respond with res.body.status of "success".', () =>
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .then(res => res.body.status.should.equal("success"))));
