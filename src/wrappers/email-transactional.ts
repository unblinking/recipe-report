/**
 * Transactional email.
 *
 * A wrapper around the transactional email service.
 *
 * Currently using the MailerSend transactional email service.
 * @see {@link https://developers.mailersend.com/general.html}
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

import { MailerSend, EmailParams, Sender, Recipient } from 'mailer-send-ts'
import { EmailMessageModel } from '../db/models/email-message-model'
import { logger } from '../wrappers/log'
import { Err } from '../wrappers/error'
import { errMsg } from '../constants'

/**
 * Send an email.
 * @param {EmailMessageModel} Email message model.
 */
export async function sendEmail(email: EmailMessageModel): Promise<void> {
  logger.trace(`email-transactional sendEmail()`)
  if (!email.from) {
    throw new Err(`EMAIL_FROM`, errMsg.EMAIL_FROM)
  }
  if (!email.to) {
    throw new Err(`EMAIL_TO`, errMsg.EMAIL_TO)
  }
  if (!email.subject) {
    throw new Err(`EMAIL_SUBJECT`, errMsg.EMAIL_SUBJECT)
  }
  if (!email.body) {
    throw new Err(`EMAIL_BODY`, errMsg.EMAIL_BODY)
  }
  if (process.env.NODE_ENV === `production`) {
    if (!process.env.MAILER_SEND_KEY) {
      throw new Err(`EMAIL_MS_API_KEY`, errMsg.EMAIL_MS_API_KEY)
    }
    const mailerSend = new MailerSend({ apiKey: process.env.MAILER_SEND_KEY })
    const sentFrom = new Sender(email.from, `Recipe.Report`)
    const recipients = [new Recipient(email.to, email.to)]
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(email.subject)
      .setText(email.body)
    const response = await mailerSend.email.send(emailParams)
    logger.info(`MailerSend response status code: ${response.statusCode}`)
  } else {
    logger.info(
      `Email not sent in development mode.\n\nFROM: ${email.from}\nTO: ${email.to}\nSUBJECT: ${email.subject}\n${email.body}`
    )
  }
}
