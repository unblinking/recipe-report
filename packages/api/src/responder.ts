/**
 * Responder.
 *
 * Expressjs response wrapper functions.
 * Format based partly on omniti-labs/jsend {@link https://github.com/omniti-labs/jsend JSend}
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
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
import { httpStatusValueType, outcomes } from '@recipe-report/data'
import { errClient } from '@recipe-report/domain/models'
import { log } from '@recipe-report/service'
import type { Response } from 'express'

export class Responder {
  // All went well, and (usually) some data was returned.
  public static success = (
    res: Response,
    statusCode: httpStatusValueType,
    data?: Record<string, unknown>,
  ): void => {
    log.trace(`Responder success ${statusCode}`)
    res.status(statusCode).json({ status: outcomes.SUCCESS, data: data })
  }

  // There was a problem with the data submitted, or some pre-condition of the
  // API call wasn't satisfied.
  public static fail = (
    res: Response,
    statusCode: httpStatusValueType,
    message?: string, // A meaningful, end-user-readable message, explaining what went wrong.
    errName?: string, // An internal error name if applicable.
    data?: Record<string, unknown>, // A generic container for any other information about the failure.
  ): void => {
    log.info(`Responder fail ${statusCode} ${errName} ${message}`)
    res.status(statusCode).json({
      status: outcomes.FAIL,
      message: message,
      code: errName,
      data: data,
    })
  }

  // An error occurred in processing the request, i.e. an exception was thrown.
  public static error = (
    res: Response,
    statusCode: httpStatusValueType,
    message?: string, // A meaningful, end-user-readable message, explaining what went wrong.
    errName?: string, // An internal error name if applicable.
  ): void => {
    log.error(`Responder error ${statusCode} ${errName} ${message}`)
    res.status(statusCode).json({
      status: outcomes.ERROR,
      message: errClient.LASTSTOP_500,
    })
  }
}
