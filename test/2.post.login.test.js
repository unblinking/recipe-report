// Set the NODE_ENV environmental variable to test
process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var should = require('should');

describe('POST /login', function() {
    it('should respond with the JSON object { status : "success" } when username and pas' +
        'sword are sent with a POST request',
        function(done) {
            request(app)
                .post('/login')
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
                    // Success at this point, so save this token for next test
                    process.env["MOCHA_TOKEN"] = res.body.data.token;
                    done();
                });
        });
});