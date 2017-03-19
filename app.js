#!/usr/bin/env node

/**
 * The application entry point for the Grocereport API server.
 * @namespace app
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
"use strict";

/**
 * Require the 3rd party modules that will be used.
 * @see {@link https://github.com/expressjs/body-parser Express body-parser}
 * @see {@link https://github.com/expressjs/express Express}
 * @see {@link https://github.com/helmetjs Helmet}
 * @see {@link https://github.com/Automattic/mongoose Mongoose}
 * @see {@link https://github.com/jaredhanson/passport Passport}
 * @see {@link https://github.com/nodenica/node-heroku-ssl-redirect sslRedirect}
 */
var bodyParser = require("body-parser");
var express = require("express");
var helmet = require("helmet");
var mongoose = require("mongoose");
var passport = require("passport");
var sslRedirect = require("heroku-ssl-redirect");

/**
 * Require the local modules that will be used.
 * @var {object} routes The application end points
 */
var routes = require("./routes/routes.js");

/**
 * Define the port for the application entry point to listen on.
 * Use port 1138 if environmental variable PORT is not defined.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt MDN JavaScript parseInt}
 */
var port = parseInt(process.env.PORT, 10) || 1138;

/**
 * Connect to the MongoDB instance.
 * Use uri "mongodb://localhost/" if environmental variable MONGODB_URI is not defined.
 */
var mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/";
mongoose.Promise = global.Promise; // https://github.com/Automattic/mongoose/issues/4291
mongoose.connect(mongodb_uri);

/**
 * Define all app configurations here except routes (define routes last).
 * Instantiate the Express application.
 */
var app = express();
app.use(helmet());
app.use(sslRedirect());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true // When true uses {@link https://github.com/ljharb/qs qs querystring parsing}
}));
app.use(passport.initialize());
app.set('json spaces', 2);

/**
 * Define routes last, after all other configurations.
 * @param {object} app - The Express application instance.
 */
routes(app);

/**
 * Listen for connections on the specified port.
 * @see {@link https://expressjs.com/en/api.html#app.listen Express API app.listen}
 */
app.listen(port, function () {
    console.log(`Grocereport API running on port: ${port}`);
}).on('error', function (err) {
    console.log(err);
    // TODO: If error, try again a number of times and then give up.
});

/**
 * Assign our app object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = app; // For testing with supertest