/**
 * Email model.
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
import { EmailMap } from 'domain/maps/email-map'
import { Model } from 'domain/models/base-model'
import { Err, errMsg } from 'domain/models/err-model'
import { EmailAddress } from 'domain/value/email-address-value'
import { UniqueId } from 'domain/value/uid-value'

import {
  addressNoReply,
  subjectActivation,
  templateActivation,
} from 'data/email-templates'

export interface IEmailDto {
  from?: string
  to?: string
  subject?: string
  body?: string
}

export interface IEmail {
  from: EmailAddress
  to: EmailAddress
  subject: string
  body: string
}

export class Email extends Model<IEmail> {
  public get from(): EmailAddress {
    return this._props.from
  }

  public get to(): EmailAddress {
    return this._props.to
  }

  public get subject(): string {
    return this._props.subject
  }

  public get body(): string {
    return this._props.body
  }

  // Private constructor to control instantiation via factory method.
  private constructor(props: IEmail, id?: UniqueId) {
    super(props, id)
  }

  // Factory method here instead of a factory class.
  public static create(props: IEmail): Email {
    if (!EmailMap.isEmail(props)) {
      throw new Err(`MISSING_REQ`, `${errMsg.MISSING_REQ}`)
    }
    return new Email(props)
  }

  public static createActivation(to: EmailAddress, token: string): Email {
    const from = addressNoReply
    return Email.create({
      from: from,
      to: to,
      subject: subjectActivation,
      body: templateActivation(to, token),
    })
  }
}
