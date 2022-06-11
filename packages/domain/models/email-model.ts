/**
 * Email model.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report API server.
 * @see {@link https://github.com/unblinking/recipe-report}
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
import type { IEmail } from '@recipe-report/domain/interfaces'
import { EmailMap } from '@recipe-report/domain/maps'
import { Err, errClient, Model } from '@recipe-report/domain/models'
import { EmailAddress, UniqueId } from '@recipe-report/domain/values'

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
      throw new Err(`MISSING_REQ`, `Email: ${errClient.MISSING_REQ}`)
    }
    return new Email(props)
  }

  public static createActivation(to: EmailAddress, token: string): Email {
    const from = Email.addressNoReply
    return Email.create({
      from: from,
      to: to,
      subject: Email.subjectActivation,
      body: Email.templateActivation(to, token),
    })
  }

  public static addressNoReply = EmailAddress.create(`no-reply@recipe.report`)

  public static subjectActivation = `Recipe.Report new user account activation required.`

  public static templateActivation = (to: EmailAddress, token: string): string => {
    return `
Hello ${to.value},

Thank you for registering with my.recipe.report recently. You may login after completing activation. Please follow the link below to activate your new account. The link will expire in 24 hours.

${this.getProtocol()}://${this.getHostname()}/activate/${token}

You received this email because you (or someone else) used this email address to create a new account.

Thank you,

https://my.recipe.report

`
  }

  private static getProtocol = (): string => {
    let protocol = `http`
    if (process.env['NODE_ENV'] === 'production') {
      protocol = `https`
    }
    return protocol
  }

  private static getHostname = (): string => {
    let hostname = `127.0.0.1:3000`
    if (process.env['NODE_ENV'] === 'production') {
      hostname = `my.recipe.report`
    }
    return hostname
  }
}
