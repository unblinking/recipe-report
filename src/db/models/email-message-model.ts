/**
 * Email message model.
 * @author {@link https://github.com/jmg1138 jmg1138}
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
