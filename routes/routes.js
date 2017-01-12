var appRouter = function(app) {

    app.get('/', function(req, res) {
        res.send('hello');
    });

    app.post('/login', function(req, res) {
        res.send(`Thank you ${req.body.name}`);
    });

}

module.exports = appRouter;