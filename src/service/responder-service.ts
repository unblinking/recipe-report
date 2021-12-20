/**
 * Responder service.
 *
 * Expressjs response wrapper functions.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2021
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/nothingworksright/api.recipe.report}
 *
 * Recipe.Report API Server is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report API Server is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import { Response } from 'express'

import { httpStatus, httpStatusValueType } from '../data/constants'

import { log } from '../utils'

/**
 * Jsend interface definition.
 * Based on omniti-labs/jsend {@link https://github.com/omniti-labs/jsend JSend}
 *
 * @interface Jsend
 */
export interface Jsend {
  success(res: Response, data?: Record<string, unknown>): void
  fail(res: Response, data?: Record<string, unknown>): void
  error(
    res: Response,
    message: string,
    code?: httpStatusValueType,
    data?: Record<string, unknown>,
  ): void
}

/**
 * Responder service implementation.
 *
 * @class Responder
 * @implements {Jsend}
 */
export class Responder implements Jsend {
  statusCode: httpStatusValueType

  constructor(statusCode?: httpStatusValueType) {
    // Default status code to 200 OK.
    this.statusCode = statusCode ?? httpStatus.OK
  }

  /**
   * All went well, and (usually) some data was returned.
   *
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Record<string, unknown>} [data] Any data returned by the API.
   * @memberof Responder
   */
  public success = (res: Response, data?: Record<string, unknown>): void => {
    log.info(`Responder|Success|${this.statusCode}`)
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
   *      details of why the request failed. If the reasons for failure
   *      correspond to POST values, the response object's keys SHOULD
   *      correspond to those POST values.
   * @memberof Responder
   */
  public fail = (
    res: Response,
    data?: Record<string, unknown> | string,
  ): void => {
    log.info(`Responder|Fail|${this.statusCode}`)
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
   *      log-worthy) message, explaining what went wrong.
   * @param {httpStatusValueType} [code] A code corresponding to the error, if
   *      applicable.
   * @param {Record<string, unknown>} [data] A generic container for any other
   *      information about the error, i.e. the conditions that caused the
   *      error, stack trace, etc.
   * @memberof Responder
   */
  public error = (
    res: Response,
    message: string,
    code?: httpStatusValueType,
    data?: Record<string, unknown>,
  ): void => {
    log.error(`Responder|Error|${this.statusCode}|${message}`)
    res.status(this.statusCode).json({
      status: 'error',
      message: message,
      code: code,
      data: data,
    })
  }
}
