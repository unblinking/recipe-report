#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit tests in special order of execution.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

// First, some preparation needs to be done.
require(`./prep/prepare`)

// Next, the lib scripts.
require(`./lib/emails`)
require(`./lib/errors`)
require(`./lib/tokens`)

// Next, the expressjs routes.
require(`./routes/root`)
require(`./routes/register`)
require(`./routes/activate`)
require(`./routes/login`)
require(`./routes/test`)
