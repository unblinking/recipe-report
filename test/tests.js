#!/usr/bin/env node
/* eslint-env mocha */

'use strict'

/**
 * Unit tests in special order of execution.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */
require(`./prepare`)
require(`./routes/root`)
require(`./routes/register`)
require(`./routes/activate`)
require(`./routes/login`)
require(`./routes/test`)
require(`./lib/tokens`)
require(`./lib/errors`)
require(`./lib/emails`)
