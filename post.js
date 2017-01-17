var request = require('request');
var options = {
    // followAllRedirects: true, // Defaut is false
    // followOriginalHttpMethod: true, // Default is false
    // maxRedirects: 1, // Default is 10
    // url: 'http://127.0.0.1:1138/login',
    url: 'http://www.grocereport.com/login',
    json: {
        name: 'Joshua'
    }
};
request.post(options, function(err, res, body) {
    console.log(body);
});