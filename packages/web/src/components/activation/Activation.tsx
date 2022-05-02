/**
 * Activation form component.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report Web Application.
 * @see {@link https://github.com/nothingworksright/recipe-report}
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
import type { ApiRequestActivation } from '@recipe-report/domain/interfaces'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from 'app/hooks'

import styles from 'components/activation/Activation.module.css'
import {
  activateAsync,
  selectActivationCode,
  selectActivationMessage,
  selectActivationStatus,
} from 'components/activation/activationSlice'
import { Alert, alertStyles } from 'components/alert/Alert'
import { Logo } from 'components/logo/Logo'
import { Spacer } from 'components/spacer/Spacer'

export function Activation(): JSX.Element {
  const status = useAppSelector(selectActivationStatus)
  const message = useAppSelector(selectActivationMessage)
  const code = useAppSelector(selectActivationCode)
  const { token } = useParams()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (token) {
      const apiRequestActivation: ApiRequestActivation = {
        token: token,
      }
      dispatch(activateAsync(apiRequestActivation))
    }
  }, [])
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <meta charSet='utf-8' />
          <title>User Activation - Recipe.Report</title>
          <link rel='canonical' href='https://my.recipe.report' />
        </Helmet>
        <form className={styles['form']}>
          <div className={styles['logo']}>
            <Logo />
          </div>
          <h1>User Activation</h1>
          <Spacer size={20} axis='vertical' />
          {token && status === 'Loading' && (
            <Alert style={alertStyles.SPIN} title={status} message={message} code={code} />
          )}
          {token && status === 'Activated' && (
            <Alert style={alertStyles.SUCCESS} title={status} message={message} code={code} />
          )}
          {token && status === 'Failed' && (
            <Alert style={alertStyles.ERROR} title={status} message={message} code={code} />
          )}
          {token && status === 'Error' && (
            <Alert style={alertStyles.ERROR} title={status} message={message} code={code} />
          )}
          {!token && (
            <Alert
              style={alertStyles.ERROR}
              title='No token'
              message='There was no token in the activation URL.'
            />
          )}
          <Spacer size={20} axis='vertical' />
          <a href='/authenticate'>Sign in</a>
        </form>
      </HelmetProvider>
    </div>
  )
}
