/**
 * User authentication model.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * User authentication model interface.
 *
 * @export
 * @interface IAuthenticationModel
 */
export interface IAuthenticationModel {
  token?: string
}

/**
 * User authentication model concrete class.
 *
 * @export
 * @class AuthenticationModel
 * @implements {IAuthenticationModel}
 */
export class AuthenticationModel implements IAuthenticationModel {
  private state: IAuthenticationModel = {}

  constructor(props: IAuthenticationModel) {
    this.setToken(props.token)
  }

  public get token(): string | undefined {
    return this.state.token
  }
  public setToken(token: string | undefined): void {
    this.state.token = token
  }
}
