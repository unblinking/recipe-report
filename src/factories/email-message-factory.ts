/**
 * Email message factory.
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
