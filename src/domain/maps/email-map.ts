/**
 * Email mapper.
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
import { Email, IEmail, IEmailDto } from 'domain/models/email-model'
import { Err, errInternal } from 'domain/models/err-model'
import { EmailAddress } from 'domain/value/email-address-value'

export class EmailMap {
  public static toDomain(emailDto: IEmailDto): Email {
    if (!this.isEmail(emailDto)) {
      throw new Err(`DOMAIN_OBJECT`, `EmailMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Email.create({
      from: EmailAddress.create(emailDto.from),
      to: EmailAddress.create(emailDto.to),
      subject: emailDto.subject,
      body: emailDto.body,
    })
  }

  public static toDto(email: Email): IEmailDto {
    return {
      from: email.from.value,
      to: email.to.value,
      subject: email.subject,
      body: email.body,
    }
  }

  public static isEmail = (raw: unknown): raw is IEmail => {
    if (!(raw as IEmail).from) return false
    if (!(raw as IEmail).to) return false
    if (!(raw as IEmail).subject) return false
    if (!(raw as IEmail).body) return false
    return true
  }
}
