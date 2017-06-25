#!/usr/bin/env node

/**
 * Test the account-registration route.
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
const request = require("supertest");
const should = require("should");

/**
 * Require the local modules that will be used.
 */
const app = require("../app");

/**
 * Test configuration.
 * Username and password are set for this (register) and the next (login) tests.
 */
process.env.NODE_ENV = "test";
process.env.MOCHA_USERNAME = new Date().getTime() + "@grocereport.com";
process.env.MOCHA_PASSWORD = new Date().getTime();
const agent = request.agent(app);

/**
 * Tests.
 */
describe("POST /register (account registration)", () => {
  it(`should respond with json, status 200, res.body.status of "success", and
      res.body.message of "Registration successful" when request sends a new
      user email and a password.`, () =>
    agent
    .post("/register")
    .set("Content-Type", "application/json")
    .send({
      email: process.env.MOCHA_USERNAME,
      password: process.env.MOCHA_PASSWORD
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("success");
      res.body.message.should.equal("Registration successful");
    })
  );
  it(`should respond with json, status 200, res.body.status of "error", and
      res.body.message of "A user with the given username is already registered"
      when request sends a previously used email and a password.`, () =>
    agent
    .post("/register")
    .set("Content-Type", "application/json")
    .send({
      email: process.env.MOCHA_USERNAME,
      password: process.env.MOCHA_PASSWORD
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("error");
      res.body.message.should.equal("A user with the given username is already registered");
    })
  );
  it(`should respond with json, status 200, res.body.status of "error", and
      res.body.message of "No password was given" when request sends an email
      but no password.`, () =>
    agent
    .post("/register")
    .set("Content-Type", "application/json")
    .send({
      email: process.env.MOCHA_USERNAME,
      password: process.env.MOCHA_PASSWORD
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("error");
      res.body.message.should.equal("A user with the given username is already registered");
    })
  );
  it(`should respond with json, status 200, res.body.status of "error", and
      res.body.message of "Email address seems invalid." when request sends no
      email.`, () =>
    agent
    .post("/register")
    .set("Content-Type", "application/json")
    .send({
      password: process.env.MOCHA_PASSWORD
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("error");
      res.body.message.should.equal("Email address seems invalid.");
    })
  );
  it(`should respond with json, status 200, res.body.status of "error", and
      res.body.message of "Email address seems invalid." when request sends an
      invalid email.`, () =>
    agent
    .post("/register")
    .set("Content-Type", "application/json")
    .send({
      email: "invalidEmail",
      password: process.env.MOCHA_PASSWORD
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then(res => {
      res.body.status.should.equal("error");
      res.body.message.should.equal("Email address seems invalid.");
    })
  );
});
