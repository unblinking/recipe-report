/**
 * Password value object.
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
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import {
  CrackTimesSeconds,
  FeedbackType,
  LooseObject,
  MatchExtended,
} from '@zxcvbn-ts/core/dist/types'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

import { EmailAddress } from 'domain/value-objects/email-address'
import { Username } from 'domain/value-objects/username'

export interface PasswordResult {
  success: boolean
  message?: string
}

export interface ZxcvbnResult {
  feedback: FeedbackType
  crackTimesSeconds: CrackTimesSeconds
  crackTimesDisplay: LooseObject
  score: number
  password: string
  guesses: number
  guessesLog10: number
  sequence: MatchExtended[]
  calcTime: number
}

export class Password {
  private _value: string

  public constructor(value: string) {
    this._value = value
  }

  public get id(): string {
    return this._value
  }

  public async isStrong(
    name: Username,
    email_address: EmailAddress,
  ): Promise<PasswordResult> {
    const options = {
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
        userInputs: [name.toString(), email_address.toString()],
      },
    }
    ZxcvbnOptions.setOptions(options)
    const result: ZxcvbnResult = await zxcvbn(this._value)
    const score: number = result.score
    const warnings: number = result.feedback.warning ? 1 : 0
    const suggestions: number = result.feedback.suggestions.length
    const passwordResult: PasswordResult = {
      success: true,
    }
    if (score < 3 || warnings || suggestions) {
      passwordResult.success = false
      passwordResult.message = `Password is weak.`
      if (warnings) {
        passwordResult.message += ` ${result.feedback.warning}`
      }
      if (suggestions) {
        passwordResult.message += ` ${result.feedback.suggestions.join(' ')}`
      }
    }
    return passwordResult
  }
}
