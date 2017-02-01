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
 * Require the modules that will be used.
 * @var {object} passport {@link http://passportjs.org/ Passport}
 * @var {object} Account Our mongoose account model
 */
var passport = require('passport');
var account = require('../models/account');

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
     * @summary POST request to the register route. Register an account using the username and password provided when a POST request is made to the register route.
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * var request = require('request');
     * var options = {
     *     url: 'http://grocereport.com/register',
     *     json: {
     *         name: 'Joshua',
     *         password: 'Password'
     *     },
     * };
     * request.post(options, function(err, res, body) {
     *     console.log(body);
     * });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.post('/register', function(req, res, next) {
        console.log(`Registering user.`);
        account.register(new account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                res.status(401).json({
                    status: 'error',
                    message: err
                });
                return next(err);
            }
            res.status(200).json({
                message: `User ${req.body.username} registered successfully.`,
                data: {
                    username: req.body.username
                }
            });
        });
    });

    /**
     * @function app.post
     * @memberof! routes.router
     * @public
     * @summary POST request to the login route. Authenticate an account based on the username and password provided when a POST request is made to the login route.
     * @param {object} req - The HTTP request.
     * @param {object} res - The HTTP response.
     * @example
     * var request = require('request');
     * var options = {
     *     url: 'http://grocereport.com/login',
     *     json: {
     *         name: 'Joshua',
     *         password: 'Password'
     *     },
     * };
     * request.post(options, function(err, res, body) {
     *     console.log(body);
     * });
     * @see {@link https://expressjs.com/en/api.html Express API}
     */
    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.status(200).json({
            status : 'success',
            message: `User ${req.body.username} successfully authenticated.`,
            data: {
                username: req.body.username
            }
        });
    });

};

/**
 * Assign our appRouter object to module.exports.
 * @see {@link https://nodejs.org/api/modules.html#modules_the_module_object Nodejs modules: The module object}
 * @see {@link https://nodejs.org/api/modules.html#modules_module_exports Nodejs modules: module exports}
 */
module.exports = router;