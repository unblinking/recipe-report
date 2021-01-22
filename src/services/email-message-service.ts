/**
 * Email message service.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { UserModel } from '../db/models/user-model'
import { EmailMessageFactory } from '../factories/email-message-factory'
import { sendmail } from '../wrappers/send-email'
import { logger } from 'bs-logger'

interface IEmailMessageService {
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
