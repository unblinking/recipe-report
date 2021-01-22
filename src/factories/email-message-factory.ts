/**
 * Email message factory.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { EmailMessageModel } from '../db/models/email-message-model'
import { UserModel } from '../db/models/user-model'
import {
  bodyActivationTemplate,
  noReplyAddress,
  subjectActivation,
} from './email-templates'
import { DomainConverter } from '../db/models/domainconverter'

interface IEmailMessageFactory {
  activation(user: UserModel, token: string): EmailMessageModel
}

export class EmailMessageFactory implements IEmailMessageFactory {
  /**
   * Create a new user activation email.
   */
  public activation = (user: UserModel, token: string): EmailMessageModel => {
    const bodyActivation = bodyActivationTemplate(user, token)
    const emailDto = {
      from: noReplyAddress,
      to: user.email_address,
      subject: subjectActivation,
      body: bodyActivation,
    }
    const email: EmailMessageModel = DomainConverter.fromDto<EmailMessageModel>(
      EmailMessageModel,
      emailDto
    )
    return email
  }
}
