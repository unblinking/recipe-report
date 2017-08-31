#!/usr/bin/env node

'use strict'

/**
 * The root route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const root = require('../controllers/root')

let router = express.Router()
router.get('/', root.controller)

module.exports = router
