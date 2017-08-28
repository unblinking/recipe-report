#!/usr/bin/env node

'use strict'

/**
 * The root controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const respond = require('../lib/respond')

function controller (req, res) {
  try {
    respond.success(
      res,
      'This is the http://www.Recipe.Report API server.',
      { headers: req.headers }
    )
  } catch (err) {
    respond.error(res, err)
  }
}

module.exports = {
  controller: controller
}
