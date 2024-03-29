/**
 * Authentication form component.
 *
 * @author Joshua Gray {@link https://github.com/jmg1138}
 * @copyright Copyright (C) 2017-2022
 * @license GNU AGPLv3 or later
 *
 * This file is part of Recipe.Report.
 * @see {@link https://github.com/unblinking/recipe-report}
 *
 * Recipe.Report is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Recipe.Report is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @module
 */
import type { ApiRequestAuthentication } from '@recipe-report/domain/interfaces'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import styles from '../../components/authentication/Authentication.module.css'
import { Alert, alertStyles } from '../alert/Alert'
import { Logo } from '../logo/Logo'
import { Spacer } from '../spacer/Spacer'
import {
  authenticateAsync,
  selectAuthenticationCode,
  selectAuthenticationMessage,
  selectAuthenticationStatus,
} from './authenticationSlice'

interface FormSubmitAuthentication {
  email_address: string
  password: string
  remember_me: boolean
}

export function Authentication(): JSX.Element {
  const status = useAppSelector(selectAuthenticationStatus)
  const message = useAppSelector(selectAuthenticationMessage)
  const code = useAppSelector(selectAuthenticationCode)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSubmitAuthentication>()
  const onSubmit: SubmitHandler<FormSubmitAuthentication> = (data) => {
    const apiRequestAuthentication: ApiRequestAuthentication = {
      email_address: data.email_address,
      password: data.password,
    }
    dispatch(authenticateAsync(apiRequestAuthentication))
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Sign in - Recipe.Report</title>
          <link rel='canonical' href='https://my.recipe.report' />
        </Helmet>
        <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
          <div className={styles['logo']}>
            <Logo />
          </div>
          <h1>Sign in</h1>
          <Spacer size={20} axis='vertical' />
          <label>Email Address</label>
          <input
            type='text'
            className={styles['input']}
            {...register(`email_address`, { required: true })}
          />
          {errors.email_address && (
            <span className={styles['error']}>Please enter your email address.</span>
          )}
          <Spacer size={20} axis='vertical' />
          <label>Password</label>
          <input
            type='password'
            className={styles['input']}
            {...register(`password`, { required: true })}
          />
          {errors.password && <span className={styles['error']}>Please enter your password.</span>}
          <Spacer size={30} axis='vertical' />
          {status !== 'Loading' && (
            <input type='submit' className={styles['input']} value='Submit' />
          )}
          {status === 'Loading' && (
            <Alert style={alertStyles.SPIN} title={status} message={message} code={code} />
          )}
          {status === 'Failed' && (
            <Alert style={alertStyles.ERROR} title={status} message={message} code={code} />
          )}
          {status === 'Error' && (
            <Alert style={alertStyles.ERROR} title={status} message={message} code={code} />
          )}
          <Spacer size={20} axis='vertical' />
          <a href='/register'>Create an account</a>
        </form>
      </HelmetProvider>
    </div>
  )
}
