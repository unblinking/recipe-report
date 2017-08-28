#!/usr/bin/env node

'use strict'

/**
 * Unit tests in special order of execution.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */
require('./prepare')
require('./routes/root')
require('./routes/register')
require('./routes/activate')
require('./routes/login')
require('./routes/tokentest')
require('./token/generateToken')
