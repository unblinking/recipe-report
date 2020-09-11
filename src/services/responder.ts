/**
 * Responder service.
 * Expressjs response wrapper functions.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Response } from 'express'

/**
 * Jsend interface definition.
 * Based on omniti-labs/jsend {@link https://github.com/omniti-labs/jsend JSend}
 */
interface Jsend {
  // All went well, and (usually) some data was returned.
  success(res: Response, data?: Object): void
  // There was a problem with the data submitted, or some pre-condition of the
  // API call wasn't satisfied.
  fail(res: Response, data?: Object): void
  // An error occurred in processing the request, i.e. an exception was thrown
  error(res: Response, message: string, code?: string, data?: Object): void
}

/**
 * Responder service implementation.
 */
class Responder implements Jsend {
  /**
   * Send the Expressjs response with success information.
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Object} data Any data returned by the API.
   */
  public success(res: Response, data?: Object): void {
    res.status(200).json({
      status: 'success',
      data: data,
    })
  }

  /**
   * Send the Expressjs response with failure information.
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {Object} data Again, provides the wrapper for the details of why the
   *     request failed. If the reasons for failure correspond to POST values,
   *     the response object's keys SHOULD correspond to those POST values.
   */
  public fail(res: Response, data?: Object): void {
    res.status(200).json({
      status: 'fail',
      data: data,
    })
  }

  /**
   * Send the Expressjs response with error information.
   * @param {Response} res HTTP res that Expressjs sends when it gets a req.
   * @param {string} message A meaningful, end-user-readable (or at the least
   *     log-worthy) message, explaining what went wrong.
   * @param {string} code A code corresponding to the error, if applicable.
   * @param {object} data A generic container for any other information about
   *     the error, i.e. the conditions that caused the error, stack trace, etc.
   */
  public error(
    res: Response,
    message: string,
    code?: string,
    data?: Object
  ): void {
    res.status(200).json({
      status: 'error',
      message: message,
      code: code,
      data: data,
    })
  }
}

export default Responder
