#!/usr/bin/env node

"use strict";

/**
 * Test token generation.
 * @namespace testGenerateToken
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Required modules.
 */
const accountModel = require("../../models/account");
const jwt = require("../../util/jwt");
const theMoment = require("moment");

const account = new accountModel({
  email: process.env.MOCHA_USERNAME
})

/**
 * Tests.
 */
describe("JSON Web Token generator", () =>
  it(`should generate and return a JSON web token that can be decoded`, () =>
    jwt.generateToken(account)
    .then(token => jwt.decodeToken(token))
    .then(decoded => {
      describe("JWT headers", () => {
        it(`Header algorithm should equal "HS256".`, () =>
          decoded.header.alg.should.equal("HS256") // Different algorithm than production
        );
        it(`Header type should equal "JWT".`, () =>
          decoded.header.typ.should.equal("JWT")
        );
      });
      describe("JWT Payload", () => {
        it(`Payload data should equal the account model ID.`, () =>
          decoded.payload.data.toString().should.equal(account._id.toString())
        );
        it(`Payload issued date (in seconds) equals today.`, () => {
          (typeof decoded.payload.iat).should.equal("number");
          const itWasIssued = decoded.payload.iat * 1000;
          theMoment(itWasIssued).isSame(Date.now(), "day").should.equal(true);
        });
        it(`Payload expiration date is in 2 days.`, () => {
          (typeof decoded.payload.exp).should.equal("number");
          const itExpires = decoded.payload.exp * 1000;
          theMoment(itExpires).fromNow().should.equal("in 2 days");
        });
      });

      //console.log(decoded);

    })
  )
);
