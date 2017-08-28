#!/usr/bin/env node

'use strict'

/**
 * The registration route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const register = require('../controllers/register')

let router = express.Router()
router.post('/', register.newAccount)
router.get('/:token', register.activate)

module.exports = router
