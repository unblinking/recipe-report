#!/usr/bin/env node

'use strict'

/**
 * The root-route controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')

function controller (req, res) {
  respond.success(
    res,
    'This is the http://www.Recipe.Report API server.',
    { headers: req.headers }
  )
}

module.exports = {
  controller: controller
}
