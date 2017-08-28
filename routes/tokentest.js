#!/usr/bin/env node

'use strict'

/**
 * The registration route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const tokentest = require('../controllers/tokentest')

let router = express.Router()
router.get('/', tokentest.test)

module.exports = router
