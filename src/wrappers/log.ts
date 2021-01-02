/**
 * Log.
 * A basic wrapper around bs-logger.
 * @see {@link https://github.com/huafu/bs-logger bs-logger}
 */

import { createLogger } from 'bs-logger'

export const logger = createLogger({
  targets: process.env.MY_LOG_TARGETS,
})
