#!/usr/bin/env node

/**
 * Routes for the Grocereport API.
 * Define application end points and how they respond to client requests.
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
 * @namespace appRouter
 * @memberof routes
 * @public
 * @param {object} app - The Express application instance.
 * @see {@link https://expressjs.com/en/guide/routing.html Express routing}
 * @see {@link http://expressjs.com/en/api.html#app Express API app}
 */
var appRouter = function(app) {

    /**
     * @function app.get
     * @memberof! routes.appRouter
     * @public
     * @summary GET request to the root route. Sends a response of 'hello' when a GET request is made to the root route.
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * www.grocereport.com/
     * @see {@link https://expressjs.com/en/api.html#app.get Express API app.get}
     * @see {@link http://expressjs.com/en/api.html#req Express API req}
     * @see {@link http://expressjs.com/en/api.html#res Express API res}
     * @see {@link http://expressjs.com/en/api.html#res.send Express API res.send}
     */
    app.get('/', function(req, res) {
        res.send('hello');
    });

    /**
     * @function app.post
     * @memberof! routes.appRouter
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
     * @see {@link https://expressjs.com/en/api.html#app.post Express API app.post}
     * @see {@link http://expressjs.com/en/api.html#req Express API req}
     * @see {@link http://expressjs.com/en/api.html#res Express API res}
     * @see {@link http://expressjs.com/en/api.html#res.send Express API res.send}
     * @see {@link http://expressjs.com/en/api.html#req.body Express API req.body}
     */
    app.post('/login', function(req, res) {
        res.send(`Thank you ${req.body.name}`);
    });

};

/**
 * Assign our appRouter object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = appRouter;