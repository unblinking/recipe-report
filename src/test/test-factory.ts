/**
 * Test factory.
 *
 * Create objects for use in unit testing.
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
import { IUserDto, User } from 'domain/models/user'
import { EmailAddress } from 'domain/value-objects/email-address'
import { Password } from 'domain/value-objects/password'
import { Username } from 'domain/value-objects/username'

export class TestFactory {
  public userNewDto(): IUserDto {
    const userDto: IUserDto = {
      name: `noreplyuser`,
      password: `$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`,
      email_address: `noreply@recipe.report`,
      date_created: new Date().toString(),
    }
    return userDto
  }

  public userNew(): User {
    const user: User = User.create({
      name: new Username(`noreplyuser`),
      password: new Password(
        `$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`,
      ),
      email_address: new EmailAddress(`noreply@recipe.report`),
      date_created: new Date(),
    })
    return user
  }

  public userActivated(): User {
    const user: User = User.create({
      name: new Username(`noreplyuser`),
      password: new Password(
        `$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`,
      ),
      email_address: new EmailAddress(`noreply@recipe.report`),
      date_created: new Date(),
      date_activated: new Date(),
    })
    return user
  }

  public tokenActivation(): string {
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.ImNibEZSdVFwK044RFJ4akM4aW5uckZSaU1LVmpVYUVzb09xQmdwelc1Mjljdm9jLzBSMFZ4dFVmakdraTlWeXF2MHFvcU5Zdmd0aW1haFl6dHlMckRPY1Nrb0ZnanJ5Y0xDWno2Y1pBQXlYTzgxdi9kRE5WNkF3K3BkcXhqZXlTOWxtbEx0d2NZbG1HVFpZY2NjRUhKQT09Ig.fyE3vPgWjQawr68z2OtPT-pGtp43q04UKF5zlo9u4LU5bBb_Sg-5GqBbLFy9UiV_FJJIaSwrIe757fTNEvfeUw`
    return token
  }

  public tokenAccess(): string {
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.IkkvcGgyZGwrNDllclByWkxYZWpCZVVIaXFUbW1HMEZyNEFRQkRDdTlERlZmZWZBN2Jkb0hpT2xzNmJvTkhFTkovTDNCNjhjNG0rUWphYWtrM3YzT09vUWdNSm1ib0ZKQlQ1ZHVNS1JVVXA2NDJ6bkxWaEp6am5KK3pQWXU1N29GNnJ6YVZ0L3BQdWpjenJpRTVsSS9EUT09Ig.JzmOzo2oTy9Bt2bHmZbWypUG4pnR9KXnVsoagcioBDTcoJutgkhEzSxqyIFY9you73c2z6-4dS9wc8H8F4o_Pw`
    return token
  }
}
