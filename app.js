#!/usr/bin/env node

'use strict';

// Web framework courtesy of https://github.com/expressjs/express
var express = require('express');
var app = express();
var routes = require('./routes/routes.js')(app);
var server = require('http').Server(app); // https://nodejs.org/api/http.html

// Secure express app courtesy of https://github.com/helmetjs/helmet
var helmet = require('helmet');

// Parse requests courtesy of https://github.com/expressjs/body-parser
var bodyParser = require('body-parser');

// Free SSL courtesy of https://github.com/DylanPiercey/auto-sni
// and https://letsencrypt.org/
// var createServer = require("auto-sni");

// Just a few more things ...
var port = 1138; // Used when process.env.PORT doesn't exist

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
var sslSettings = {
    email: "admin@grocereport.com", // Emailed when certificates expire.
    agreeTos: true, // Required for letsencrypt.
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    forceSSL: true, // Make this false to disable auto http->https redirects (default true).
    domains: [
        ["grocereport.com"]
    ],
    redirectCode: 302, // If forceSSL is true, decide if redirect should be 301 (permanent) or 302 (temporary). Defaults to 302
    ports: {
        http: 3001, // Optionally override the default http port.
        https: 3002 // // Optionally override the default https port.
    }
};
var server = createServer(sslSettings, app);
server.once("listening", () => {
    console.log("Grocereport API server is running.");
});
*/


server.listen(process.env.PORT || port, function() {
    console.log(`Server running on http://localhost:${port}`);
});