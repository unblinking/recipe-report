// Set the NODE_ENV environmental variable to test
process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var should = require('should');

describe('POST /register', function() {
    it('should respond with the JSON object { status : "success" } when username and password are sent with a POST request',
        function(done) {
            process.env.MOCHA_USERNAME = "no-reply" + "+" + new Date().getTime() + "@grocereport.com";
            process.env.MOCHA_PASSWORD = new Date().getTime(); // A new password
            request(app)
                .post('/register')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({ username: process.env.MOCHA_USERNAME, password: process.env.MOCHA_PASSWORD })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
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