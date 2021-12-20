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
 *
 * @module
 */
import { injectable } from 'inversify'

import { DomainConverter } from '../../domain/models/domainconverter'
import { EmailModel, IEmailModel } from '../../domain/models/email-model'
import { UserModel } from '../../domain/models/user-model'

import {
  bodyActivationTemplate,
  noReplyAddress,
  subjectActivation,
} from './email-templates'

export interface IEmailFactory {
  activation(user: UserModel, token: string): EmailModel
}

@injectable()
export class EmailFactory implements IEmailFactory {
  /**
   * Create a new user activation email.
   */
  public activation = (user: UserModel, token: string): EmailModel => {
    const bodyActivation = bodyActivationTemplate(user, token)
    const emailDto: IEmailModel = {
      from: noReplyAddress,
      to: user.email_address,
      subject: subjectActivation,
      body: bodyActivation,
    }
    const email: EmailModel = DomainConverter.fromDto<EmailModel>(
      EmailModel,
      emailDto,
    )
    return email
  }
}
