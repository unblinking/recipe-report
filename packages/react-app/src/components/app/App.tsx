/**
 * App component.
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
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { Recipe } from 'components/recipe/Recipe'

import { useAppSelector } from '../../app/hooks'
import styles from '../../components/app/App.module.css'
import { Activation } from '../activation/Activation'
import { Authentication } from '../authentication/Authentication'
import { selectAuthenticationToken } from '../authentication/authenticationSlice'
import { Dashboard } from '../dashboard/Dashboard'
import { NotFound } from '../error/NotFound'
import { Footer } from '../footer/Footer'
import { NavBar } from '../navbar/NavBar'
import { Profile } from '../profile/Profile'
import { Registration } from '../registration/Registration'

export function App(): JSX.Element {
  const token = useAppSelector(selectAuthenticationToken)
  const location = useLocation()
  return (
    <div className={styles['container']}>
      <HelmetProvider>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Recipe.Report</title>
          <link rel='canonical' href='https://my.recipe.report' />
        </Helmet>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route
            path='/'
            element={
              token ? (
                <Dashboard />
              ) : (
                <Navigate to='/authenticate' state={{ from: location }} replace />
              )
            }
          />
          <Route path='/activate/:token' element={<Activation />} />
          <Route
            path='/authenticate'
            element={
              token ? <Navigate to='/' state={{ from: location }} replace /> : <Authentication />
            }
          />
          <Route
            path='/profile'
            element={
              token ? (
                <Profile />
              ) : (
                <Navigate to='/authenticate' state={{ from: location }} replace />
              )
            }
          />
          <Route
            path='/recipe'
            element={
              token ? (
                <Recipe />
              ) : (
                <Navigate to='/authenticate' state={{ from: location }} replace />
              )
            }
          />
          <Route path='/register' element={<Registration />} />
        </Routes>
        <NavBar />
        <Footer />
      </HelmetProvider>
    </div>
  )
}
