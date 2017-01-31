// Set the NODE_ENV environmental variable to test
process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var should = require('should');

describe('GET /test', function() {
    it('should respond with the JSON object { message: "Welcome to the team, DZ-015" }', function(done) {
        request(app)
            .get('/test')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ message: 'Welcome to the team, DZ-015' })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});