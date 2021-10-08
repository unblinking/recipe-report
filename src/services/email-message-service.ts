/**
 * Email message service.
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

import { UserModel } from '../db/models/user-model'
import { EmailMessageFactory } from '../factories/email-message-factory'
import { sendmail } from '../wrappers/send-email'
import { logger } from 'bs-logger'

export interface IEmailMessageService {
  sendActivation(user: UserModel, token: string): Promise<string>
}

export class EmailMessageService implements IEmailMessageService {
  public sendActivation(user: UserModel, token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Instantiate the email object.
      const emailMessageFactory = new EmailMessageFactory()
      const email = emailMessageFactory.activation(user, token)
      // Send the email.
      sendmail(
        {
          from: email.from,
          to: email.to,
          subject: email.subject,
          text: email.body,
        },
        (err: Error, reply: string) => {
          // Reply should be something like '221 Bye\r\n' if successful.
          if (err) {
            logger.error(
              `Sendmail error: Error name: ${err.name}. Error message: ${err.message}`,
              err.stack
            )
            reject(err)
          } else {
            logger.info(
              `Sendmail success. Sent activation email message to user ${user.id} ${user.email_address}. Reply: ${reply}`
            )
            resolve(reply)
          }
        }
      )
    })
  }
}
