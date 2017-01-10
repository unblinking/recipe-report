var request = require('request');

// Test a POST request to the login route
request.post(
    'http://127.0.0.1:1138/login', {
        json: {
            'username': 'nraboy',
            'password': '1234',
            'twitter': '@nraboy'
        }
    },
    function(err, res, body) {
        if (err) {
            console.log(err);
        }
        if (!err && res.statusCode == 200) {
            // console.log(res);
            console.log(body);
        }
    }
);