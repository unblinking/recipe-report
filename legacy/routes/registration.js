#!/usr/bin/env node

'use strict'

/**
 * The registration-route router.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require('express')
const registration = require('../controllers/registration')

const router = express.Router()
router.post('/', registration.creation)
router.get('/:token', registration.activation)

module.exports = router
