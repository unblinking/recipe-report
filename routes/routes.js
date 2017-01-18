#!/usr/bin/env node

/**
 * Define application end points (routes) for the Grocereport API and how they respond to client requests.
 * @namespace routes
 * @public
 * @author jmg1138 {@link https://github.com/jmg1138 jmg1138 on GitHub}
 * @copyright nothingworksright {@link https://github.com/nothingworksright nothingworksright on GitHub}
 */

/**
 * Invoke strict mode for the entire script.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode Strict mode}
 */
'use strict';

/**
 * @public
 * @namespace router
 * @memberof routes
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html Express API}
 */
var router = function(app) {

    /**
     * GET request to the root route. Responds with the JSON object { message: "hello" }
     * @public
     * @function .app.get('/')
     * @memberof! routes.router
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * // Responds with the JSON object { message: "hello" }
     * var request = require('request');
     * request('http://www.grocereport.com/',
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.get('/', function(req, res) {
        res.status(200).json({ message: 'hello' });
    });

    /**
     * GET request to the /test route. Responds with the JSON object { message: "Welcome to the team, DZ-015" }
     * @public
     * @function app.get('/test)
     * @memberof! routes.router
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * // Responds with the JSON object { message: "Welcome to the team, DZ-015" }
     * var request = require('request');
     * request('http://www.grocereport.com/test',
     *     function(err, res, body) {
     *         if (!err && res.statusCode == 200) {
     *             console.log(body);
     *         }
     *     });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.get('/test', function(req, res) {
        res.status(200).json({ message: 'Welcome to the team, DZ-015' });
    });

    /**
     * @function app.post
     * @memberof! routes.router
     * @public
     * @summary POST request to the login route. Sends a response of 'Thank you' when a POST request is made to the login route.
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * var request = require('request');
     * var options = {
     *     url: 'http://grocereport.com/login',
     *     json: {
     *         name: 'Joshua'
     *     },
     * };
     * request.post(options, function(err, res, body) {
     *     console.log(body);
     * });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.post('/login', function(req, res) {
        res.status(200).json({ name: req.body.name });
    });

};

/**
 * Assign our appRouter object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = router;