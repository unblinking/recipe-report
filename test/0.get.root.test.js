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
const request = require("supertest");
const should = require("should");

/**
 * Require the local modules that will be used.
 */
const app = require("../app");

/**
 * Test configuration.
 */
process.env.NODE_ENV = "test";
const agent = request.agent(app);

/**
 * Tests.
 */
describe("GET / (the root route)", () =>
  it(`should respond with json, status 200, res.body.status of "success", and
      res.body.message of "This is the http://www.Grocereport.com API server."`, () =>
    agent
    .get("/")
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("success");
      res.body.message.should.equal("This is the http://www.Grocereport.com API server.");
    })));
