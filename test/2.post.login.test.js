#!/usr/bin/env node

/**
 * Test the account-login route.
 * @namespace testLogin
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
 * Require the local modules that will be used.
 */
const app = require('../app');

/**
 * Test configuration.
 */
process.env.NODE_ENV = 'test';
const agent = request.agent(app);

/**
 * Tests.
 */
describe('POST /login', () => {
  it(`should respond with JSON, status 200, res.body.status of "success",
      res.body.message of "Authentication successful.", and a token in
      res.body.json.token when request sends existing user email and password.`,
    () =>
    agent
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      email: process.env.MOCHA_USERNAME,
      password: process.env.MOCHA_PASSWORD
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("success");
      res.body.message.should.equal("Authentication successful.")
      res.body.json.should.have.property("token");
      // Save the token for the next test.
      process.env.MOCHA_TOKEN = res.body.json.token;
    })
  );
  it(`should respond with status 401 Unauthorized when request sends existing
      user email and an incorrect password.`, () =>
    agent
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      email: process.env.MOCHA_USERNAME,
      password: "wrongPassword"
    })
    .expect(401)
  );
  it(`should respond with status 401 Unauthorized when request sends an unknown
      email and an existing user password.`, () =>
    agent
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      email: "unknownEmail@grocereport.com",
      password: process.env.MOCHA_PASSWORD
    })
    .expect(401)
  );
  it(`should respond with status 400 Bad Request when request sends existing
      user email and an empty password.`, () =>
    agent
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      email: process.env.MOCHA_USERNAME,
      password: ""
    })
    .expect(400)
  );
  it(`should respond with status 400 Bad Request when request sends empty email
      and existing user password.`, () =>
    agent
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      email: "",
      password: process.env.MOCHA_PASSWORD
    })
    .expect(400)
  );
  it(`should respond with status 400 Bad Request when request sends empty email
      and empty password.`, () =>
    agent
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      email: "",
      password: ""
    })
    .expect(400)
  );
  it(`should respond with status 400 Bad Request when request sends nothing.`,
    () =>
    agent
    .post('/login')
    .expect(400)
  );
});
