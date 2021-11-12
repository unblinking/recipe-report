/**
 * Helper functions for the controllers.
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
import { Responder } from '../services/responder-service'
import { httpStatus, httpStatusValueType } from '../constants'
import { logger } from '../wrappers/log'

export const success = async (
  res: Response,
  code?: httpStatusValueType,
  log?: string,
  data?: Record<string, unknown>
): Promise<void> => {
  logger.info(log as string)
  const respond = new Responder(code)
  respond.success(res, data)
}

export const fail = async (
  res: Response,
  code?: httpStatusValueType,
  log?: string,
  data?: Record<string, unknown>
): Promise<void> => {
  logger.info(log as string)
  const respond = new Responder(code)
  respond.fail(res, data)
}

export const error = async (
  message: string,
  res: Response,
  code?: httpStatusValueType,
  log?: string
): Promise<void> => {
  logger.error(log as string)
  const respond = new Responder(code)
  respond.error(res, message, httpStatus.INTERNAL_ERROR)
}
