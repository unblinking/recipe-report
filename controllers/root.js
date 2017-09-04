#!/usr/bin/env node

'use strict'

/**
 * The root-route controller.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

const responds = require(`../lib/responds`)

function curtsy (req, res) {
  responds.success(
    res,
    `Welcome to the Recipe.Report API server.`,
    { headers: req.headers }
  )
}

module.exports = {
  curtsy: curtsy
}
