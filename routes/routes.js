var appRouter = function(app) {

    app.get('/', function(req, res) {
        res.send('hello');
    });

    app.get('/login', function(req, res) {
        var bundle = {
            'username': 'nraboy',
            'password': '1234',
            'twitter': '@nraboy'
        }
        if (!req.query.username) {
            return res.send({ 'status': 'error', 'message': 'missing username' });
        } else if (req.query.username != accountMock.username) {
            return res.send({ 'status': 'error', 'message': 'wrong username' });
        } else {
            return res.send(accountMock);
        }
    });

    app.post('/login', function(req, res) {
        if (!req.body.username || !req.body.password || !req.body.twitter) {
            return res.send({ 'status': 'error', 'message': 'missing a parameter' });
        } else {
            return res.send('Account created');
        }
    });

}

module.exports = appRouter;