// Set the NODE_ENV environmental variable to test
process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var should = require('should');

describe('POST /register', function() {
    it('should respond with the JSON object { status : "success" } when username and password are sent with a POST request', function(done) {
        username = new Date().getTime();
        request(app)
            .post('/register')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ username: 'testuser', password: 'testpassword'})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ status : 'success' })
            .end(function(err, res) {
                if (err) return done(err);
                console.log(`RESPONSE BODY: ${JSON.stringify(res.body, null, 4)}`);
                done();
            });
    });
});