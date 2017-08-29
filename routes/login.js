#!/usr/bin/env node

'use strict'

/**
 * The registration route.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const Account = require('../models/account')
const express = require('express')
const login = require('../controllers/login')
const passport = require('passport')

let router = express.Router()
passport.use(Account.createStrategy())
router.post('/', passport.authenticate('local', { 'session': false }), login.accessToken)

module.exports = router
