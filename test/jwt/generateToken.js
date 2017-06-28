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

const account = new accountModel({
  email: process.env.MOCHA_USERNAME
})

/**
 * Tests.
 */
describe("JSON web token generation", () =>
  it(`should generate and return a JSON web token that can be decoded, with
      header.alg of "HS256", header.typ of "JWT", payload.data of the account
      model ID, payload.iat of a number, and payload.exp of a number.`, () =>
    jwt.generateToken(account)
    .then(token => jwt.decodeToken(token))
    .then(decoded => {
      decoded.header.alg.should.equal("HS256"); // Different algorithm than production
      decoded.header.typ.should.equal("JWT");
      JSON.stringify(decoded.payload.data).should.equal(JSON.stringify(account._id));
      (typeof decoded.payload.iat).should.equal("number");
      (typeof decoded.payload.exp).should.equal("number");
    })
  )
);
