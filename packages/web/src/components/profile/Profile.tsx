/**
 * Profile component.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/nothingworksright/my.recipe.report}
 *
 * Recipe.Report Web App is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report Web App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import type { AccountDto } from '@recipe-report/domain'
import type { UserDto } from '@recipe-report/domain'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { useAppDispatch, useAppSelector } from 'app/hooks'

import { selectToken } from 'components/authentication/authenticationSlice'
import styles from 'components/profile/Profile.module.css'
import { profileAsync, selectUser } from 'components/profile/profileSlice'
import { Spacer } from 'components/spacer/Spacer'

import type { ApiRequestProfile } from 'interfaces/apiInterfaces'

import { parse } from 'wrappers/jwt'
import type { Claims } from 'wrappers/jwt'

export function Profile(): JSX.Element {
  const token = useAppSelector(selectToken)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (token) {
      const payload: Claims = parse(token)
      const apiRequestProfile: ApiRequestProfile = {
        id: payload.sub,
        token: token,
      }
      dispatch(profileAsync(apiRequestProfile))
    }
  })
  const user = useAppSelector(selectUser)
  const userInfo = UserRecord(user)
  const userAccounts = UserAccounts(user?.accounts)
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>User Profile - Recipe.Report</title>
        <link rel='canonical' href='https://my.recipe.report' />
      </Helmet>
      <div className={styles['container']}>
        {userInfo}
        <Spacer size={20} axis='vertical' />
        {userAccounts}
      </div>
    </div>
  )
}

function UserRecord(user: UserDto | null | undefined): JSX.Element {
  return (
    <div>
      <h1>User Profile</h1>
      <table>
        <tbody>
          <tr>
            <th>User Name</th>
            <td>{user?.name}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>{user?.email_address}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function UserAccounts(accounts: AccountDto[] | null | undefined): JSX.Element {
  return (
    <div>
      <h1>User Accounts</h1>
      <table>
        <tbody>
          {accounts?.map((account) => (
            <tr>
              <th>Account Name</th>
              <td>{account.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
