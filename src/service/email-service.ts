/**
 * Email service.
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
import { inject, injectable } from 'inversify'
import { EmailParams, MailerSend, Recipient, Sender } from 'mailer-send-ts'

import { errMsg } from '../data/constants'
import { IEmailFactory } from '../data/factories/email-factory'

import { EmailModel } from '../domain/models/email-model'
import { UserModel } from '../domain/models/user-model'

import { Err, log } from '../utils'

import { TYPES } from '../types'

export interface IEmailService {
  sendActivation(user: UserModel, token: string): Promise<void>
}

@injectable()
export class EmailService implements IEmailService {
  private _emailFactory: IEmailFactory

  constructor(@inject(TYPES.IEmailFactory) emailFactory: IEmailFactory) {
    this._emailFactory = emailFactory
  }

  public async sendActivation(user: UserModel, token: string): Promise<void> {
    // Instantiate the email object.
    const email = this._emailFactory.activation(user, token)
    // Send the email.
    log.info(`Sending activation email to user ${user.id}.`)
    await this._sendTransactional(email)
  }

  /**
   * Send an email.
   * @param {EmailModel} Email model.
   */
  private async _sendTransactional(email: EmailModel): Promise<void> {
    log.trace(`email-transactional-service send()`)
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
      log.info(`MailerSend response status code: ${response.statusCode}`)
    } else {
      log.info(
        `Email not sent in development mode.\n\nFROM: ${email.from}\nTO: ${email.to}\nSUBJECT: ${email.subject}\n${email.body}`,
      )
    }
  }
}