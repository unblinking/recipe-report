#!/usr/bin/env node

'use strict'

/**
 * The test-route router.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const express = require(`express`)
const tokenwall = require(`./tokenwall`)
const test = require(`../controllers/test`)

let router = express.Router()
router.get(`/`, tokenwall.middleware, test.success)

module.exports = router
