/**
 * Test factory.
 * Create objects for use in unit testing.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { IUserModel, UserModel } from '../db/models/user-model'
// import { encodeToken } from '../wrappers/token'

const userId = `9aa98e23-24ec-4403-8517-ca27968cfe25`

export class TestFactory {
  public async userNew(): Promise<UserModel> {
    const props: IUserModel = {
      id: userId,
      username: `noreplyuser`,
      password: `$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`,
      email_address: `noreply@recipe.report`,
      date_created: new Date(),
    }
    const user: UserModel = new UserModel(props)
    return user
  }

  public async userActivated(): Promise<UserModel> {
    const user = await this.userNew()
    user.setDateActivated(new Date())
    return user
  }

  public async tokenActivation(): Promise<string> {
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.ImNibEZSdVFwK044RFJ4akM4aW5uckZSaU1LVmpVYUVzb09xQmdwelc1Mjljdm9jLzBSMFZ4dFVmakdraTlWeXF2MHFvcU5Zdmd0aW1haFl6dHlMckRPY1Nrb0ZnanJ5Y0xDWno2Y1pBQXlYTzgxdi9kRE5WNkF3K3BkcXhqZXlTOWxtbEx0d2NZbG1HVFpZY2NjRUhKQT09Ig.fyE3vPgWjQawr68z2OtPT-pGtp43q04UKF5zlo9u4LU5bBb_Sg-5GqBbLFy9UiV_FJJIaSwrIe757fTNEvfeUw`
    return token
  }

  public async tokenAccess(): Promise<string> {
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.IkkvcGgyZGwrNDllclByWkxYZWpCZVVIaXFUbW1HMEZyNEFRQkRDdTlERlZmZWZBN2Jkb0hpT2xzNmJvTkhFTkovTDNCNjhjNG0rUWphYWtrM3YzT09vUWdNSm1ib0ZKQlQ1ZHVNS1JVVXA2NDJ6bkxWaEp6am5KK3pQWXU1N29GNnJ6YVZ0L3BQdWpjenJpRTVsSS9EUT09Ig.JzmOzo2oTy9Bt2bHmZbWypUG4pnR9KXnVsoagcioBDTcoJutgkhEzSxqyIFY9you73c2z6-4dS9wc8H8F4o_Pw`
    return token
  }
}
