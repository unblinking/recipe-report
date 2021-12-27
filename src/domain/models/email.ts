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
import { Model } from 'domain/models/base'
import { EmailAddress } from 'domain/value-objects/email-address'
import { UniqueId } from 'domain/value-objects/uid'

import { errMsg } from 'data/constants'

import { Err } from 'root/utils'

export interface IEmailDto {
  from?: EmailAddress
  to?: EmailAddress
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

  private constructor(props: IEmail, id?: UniqueId) {
    super(props, id)
  }

  public static create(props: IEmail): Email {
    if (!props.from.valid) throw new Err('EMAIL_INVALID', errMsg.EMAIL_INVALID)
    if (!props.to.valid) throw new Err('EMAIL_INVALID', errMsg.EMAIL_INVALID)

    return new Email(props)
  }

  public static createActivation(
    emailAddress: EmailAddress,
    token: string,
  ): Email {
    const from = noReplyAddress
    const to = new EmailAddress(emailAddress.toString())
    if (!to || !to.valid) throw new Err('EMAIL_INVALID', errMsg.EMAIL_INVALID)

    return Email.create({
      from: from,
      to: to,
      subject: subjectActivation,
      body: activationTemplate(to, token),
    })
  }
}

const getProtocol = (): string => {
  let protocol = `http`
  if (process.env.NODE_ENV === 'production') {
    protocol = `https`
  }
  return protocol
}

const getHostname = (): string => {
  let hostname = `localhost:1138`
  if (process.env.NODE_ENV === 'production') {
    hostname = `api.recipe.report`
  }
  return hostname
}

const noReplyAddress = new EmailAddress(`no-reply@recipe.report`)
const subjectActivation = `Recipe.Report new user account activation required.`

export const activationTemplate = (to: EmailAddress, token: string): string => {
  return `
Hello ${to},

Thank you for registering with Recipe.Report recently. You may login after completing activation. Please follow the link below to activate your new account. The link will expire in 24 hours.

${getProtocol()}://${getHostname()}/v1/user/activation/${token}

You received this email because you (or someone else) used this email address to create a new account.

Thank you,

http://www.Recipe.Report

`
}
