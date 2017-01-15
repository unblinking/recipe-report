var request = require('request');
var options = {
    url: 'http://127.0.0.1:1138/login',
    json: {
        name: 'Joshua'
    },
};
request.post(options, function(err, res, body) {
    console.log(body);
});