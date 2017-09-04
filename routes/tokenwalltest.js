#!/usr/bin/env node

'use strict'

/**
 * The tokenwall-test route.
 * I used this to test the tokenwall middleware.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const tokenwall = require('./tokenwall')
const tokenwalltest = require('../controllers/tokenwalltest')

let router = express.Router()
router.get('/', tokenwall.middleware, tokenwalltest.test)
router.get('/throws', tokenwalltest.throws)

module.exports = router
