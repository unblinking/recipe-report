#!/usr/bin/env node
"use strict";

/**
 * Unit test of the root route of the API.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Required modules.
 * @see {@link https://github.com/visionmedia/supertest supertest}
 */
const app = require("../../app");
const supertest = require("supertest");

/**
 * Tests.
 */
describe("GET / (the root route)", () =>
  it(`should respond with json, status 200, res.body.status of "success", and
      res.body.message of "This is the http://www.Grocereport.com API server."`,
    () =>
    supertest(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("success");
      res.body.message.should.equal("This is the http://www.Grocereport.com API server.");
    })));
