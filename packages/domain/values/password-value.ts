/**
 * Password value object.
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
import { ValueObject } from '@recipe-report/domain/values'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import type {
  CrackTimesSeconds,
  FeedbackType,
  LooseObject,
  MatchExtended,
} from '@zxcvbn-ts/core/dist/types'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

// import { errMsg } from 'data/constants'
// import { Err } from 'root/utils'

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

export interface IPassword {
  value: string
}

export class Password extends ValueObject<IPassword> {
  public get value(): string {
    return this.props.value
  }

  private constructor(props: IPassword) {
    super(props)
  }

  public static create(password: string): Password {
    // For now, commenting this out. Not going to check on the password
    // strength here. Will check strength from the service layer.
    /*
    const result: PasswordResult = await isStrongPassword(password)
    if (!result.success) {
      throw new Err(`PASS_WEAK`, `${errMsg.PASS_WEAK} ${result.message}`)
    }
    */
    return new Password({ value: password })
  }
}

export const isStrongPassword = async (
  password: string = '',
  name?: string,
  email_address?: string,
): Promise<PasswordResult> => {
  const userInputs = []
  if (name) {
    userInputs.push(name)
  }
  if (email_address) {
    userInputs.push(email_address)
  }
  const options = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
      userInputs: userInputs,
    },
  }
  zxcvbnOptions.setOptions(options)
  const result: ZxcvbnResult = await zxcvbn(password)
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
