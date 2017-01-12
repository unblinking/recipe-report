#!/usr/bin/env node

'use strict';

// Web framework courtesy of https://github.com/expressjs/express
var express = require('express');
// Parse requests courtesy of https://github.com/expressjs/body-parser
var bodyParser = require('body-parser');

var port = process.env.PORT || 1138;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require('./routes/routes.js')(app);

app.listen(port, function() {
    console.log(`App running on http://localhost:${port}`);
});