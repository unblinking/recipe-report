/**
 * Email message model.
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

/**
 * Email message model interface.
 */
export interface IEmailMessageModel {
  from?: string
  to?: string
  subject?: string
  body?: string
}

/**
 * Email message model concrete class.
 */
export class EmailMessageModel implements IEmailMessageModel {
  private state: IEmailMessageModel = {}

  constructor(props: IEmailMessageModel) {
    this.set_from(props.from)
    this.set_to(props.to)
    this.set_subject(props.subject)
    this.set_body(props.body)
  }

  public get from(): string | undefined {
    return this.state.from
  }
  public set_from(from: string | undefined): void {
    this.state.from = from
  }

  public get to(): string | undefined {
    return this.state.to
  }
  public set_to(to: string | undefined): void {
    this.state.to = to
  }

  public get subject(): string | undefined {
    return this.state.subject
  }
  public set_subject(subject: string | undefined): void {
    this.state.subject = subject
  }

  public get body(): string | undefined {
    return this.state.body
  }
  public set_body(body: string | undefined): void {
    this.state.body = body
  }
}
