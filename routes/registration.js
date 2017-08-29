#!/usr/bin/env node

'use strict'

/**
 * The registration route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const registration = require('../controllers/registration')

let router = express.Router()
router.post('/', registration.creation)
router.get('/:token', registration.activation)

module.exports = router
