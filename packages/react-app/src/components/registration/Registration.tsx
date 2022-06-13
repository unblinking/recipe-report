/**
 * Registration form component.
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
import type { ApiRequestRegistration } from '@recipe-report/domain/interfaces'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import styles from '../../components/registration/Registration.module.css'
import { Alert, alertStyles } from '../alert/Alert'
import { Logo } from '../logo/Logo'
import { Spacer } from '../spacer/Spacer'
import {
  registerAsync,
  selectRegistrationCode,
  selectRegistrationMessage,
  selectRegistrationStatus,
} from './registrationSlice'

interface FormSubmitRegistration {
  name: string
  email_address: string
  password: string
}

export function Registration(): JSX.Element {
  const status = useAppSelector(selectRegistrationStatus)
  const message = useAppSelector(selectRegistrationMessage)
  const code = useAppSelector(selectRegistrationCode)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSubmitRegistration>()
  const onSubmit: SubmitHandler<FormSubmitRegistration> = (data) => {
    const ApiRequestRegistration: ApiRequestRegistration = {
      name: data.name,
      email_address: data.email_address,
      password: data.password,
    }
    dispatch(registerAsync(ApiRequestRegistration))
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Register - Recipe.Report</title>
          <link rel='canonical' href='https://my.recipe.report' />
        </Helmet>
        <form onSubmit={handleSubmit(onSubmit)} className={styles['form']}>
          <div className={styles['logo']}>
            <Logo />
          </div>
          <h1>Create an account</h1>
          <Spacer size={20} axis='vertical' />
          <label>Username</label>
          <input
            type='text'
            className={styles['input']}
            {...register(`name`, { required: true })}
          />
          {errors.name && (
            <span className={styles['error']}>Please enter your desired username.</span>
          )}
          <Spacer size={20} axis='vertical' />
          <label>Email address</label>
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
          {errors.password && (
            <span className={styles['error']}>Please enter your new secure password.</span>
          )}
          <Spacer size={30} axis='vertical' />
          {status !== 'Registered' && status !== 'Loading' && (
            <input type='submit' className={styles['input']} value='Submit' />
          )}
          {status === 'Loading' && (
            <Alert style={alertStyles.SPIN} title={status} message={message} code={code} />
          )}
          {status === 'Registered' && (
            <Alert style={alertStyles.SUCCESS} title={status} message={message} code={code} />
          )}
          {status === 'Failed' && (
            <Alert style={alertStyles.ERROR} title={status} message={message} code={code} />
          )}
          {status === 'Error' && (
            <Alert style={alertStyles.ERROR} title={status} message={message} code={code} />
          )}
          <Spacer size={20} axis='vertical' />
          <a href='/authenticate'>Sign in</a>
        </form>
      </HelmetProvider>
    </div>
  )
}
