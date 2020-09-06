#!/usr/bin/env node

'use strict'

/**
 * Datastore wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { sql, PgSqlDatabase, CrudRepository } from 'kiss-orm'

const db = new PgSqlDatabase({ })

