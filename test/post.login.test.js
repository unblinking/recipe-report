// Set the NODE_ENV environmental variable to test
process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var should = require('should');

describe('POST /login', function() {
    it('should respond with the JSON object { name: username } where username is the name being sent with the POST request', function(done) {
        username = new Date().getTime();
        request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ name: username })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ name: username })
            .end(function(err, res) {
                if (err) return done(err);
                console.log(`RESPONSE BODY: ${JSON.stringify(res.body, null, 4)}`);
                done();
            });
    });
});