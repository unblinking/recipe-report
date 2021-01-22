/**
 * Responder service.
 * Expressjs response wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Response } from 'express'
import { logger } from '../wrappers/log'

/**
 * Jsend interface definition.
 * Based on omniti-labs/jsend {@link https://github.com/omniti-labs/jsend JSend}
 *
 * @interface Jsend
 */
interface Jsend {
  success(res: Response, data?: Record<string, unknown>): void
  fail(res: Response, data?: Record<string, unknown>): void
  error(
    res: Response,
    message: string,
    code?: string,
    data?: Record<string, unknown>
  ): void
}

/**
 * Responder service implementation.
 *
 * @class Responder
 * @implements {Jsend}
 */
export class Responder implements Jsend {
  statusCode: number

  constructor(statusCode?: number) {
    this.statusCode = statusCode ?? 200
  }

  /**
   * All went well, and (usually) some data was returned.
   *
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Record<string, unknown>} [data] Any data returned by the API.
   * @memberof Responder
   */
  public success = (res: Response, data?: Record<string, unknown>): void => {
    logger.info(`Responder|Success|${this.statusCode}`)
    res.status(this.statusCode).json({
      status: 'success',
      data: data,
    })
  }

  /**
   * There was a problem with the data submitted, or some pre-condition of the
   * API call wasn't satisfied.
   *
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Record<string, unknown>} [data] Again, provides the wrapper for the
   *     details of why the request failed. If the reasons for failure
   *     correspond to POST values, the response object's keys SHOULD correspond
   *     to those POST values.
   * @memberof Responder
   */
  public fail = (
    res: Response,
    data?: Record<string, unknown> | string
  ): void => {
    logger.warn(`Responder|Fail|${this.statusCode}`)
    res.status(this.statusCode).json({
      status: 'fail',
      data: data,
    })
  }

  /**
   * Send the Expressjs response with error information.
   * @param {Response} res
   * @param {string} message
   * @param {string} code
   * @param {Record<string, unknown>} data
   */

  /**
   * An error occurred in processing the request, i.e. an exception was thrown.
   *
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {string} message A meaningful, end-user-readable (or at the least
   *     log-worthy) message, explaining what went wrong.
   * @param {string} [code] A code corresponding to the error, if applicable.
   * @param {Record<string, unknown>} [data] A generic container for any other
   *     information about the error, i.e. the conditions that caused the error,
   *     stack trace, etc.
   * @memberof Responder
   */
  public error = (
    res: Response,
    message: string,
    code?: string,
    data?: Record<string, unknown>
  ): void => {
    logger.error(`Responder|Error|${this.statusCode}|${message}`)
    res.status(this.statusCode).json({
      status: 'error',
      message: message,
      code: code,
      data: data,
    })
  }
}
