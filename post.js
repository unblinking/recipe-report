var request = require('request');

request.post(
    'http://127.0.0.1:1138/account', {
        json: {
            "username": "nraboy",
            "password": "1234",
            "twitter": "@nraboy"
        }
    },
    function(err, res, body) {
        if (err) {
            console.log(err);
        }
        if (!err && res.statusCode == 200) {
            console.log(res);
            console.log(body);
        }
    }
);