// Set the NODE_ENV environmental variable to test
process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var should = require('should');

describe('GET /test', function() {
    it('should respond with the JSON object { status : "success" } when a valid token is' +
        ' sent with a GET request',
        function(done) {
            request(app)
                .get('/test')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', process.env.MOCHA_TOKEN)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res
                        .body
                        .status
                        .should
                        .equal("success")
                    done();
                });
        });
});