#!/usr/bin/env node

'use strict'

/**
 * The tokenwall-test route.
 * I used this to test the tokenwall middleware.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const tokenwalltest = require('../controllers/tokenwalltest')

let router = express.Router()
router.get('/', tokenwalltest.test)

module.exports = router
