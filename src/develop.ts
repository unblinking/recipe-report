/**
 * Recipe.Report API Server
 *
 * This is the development mode 'main' script for the Recipe.Report API
 * server.
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
 */

import MailDev from 'maildev'

import { logger } from './wrappers/log'
import { start } from './recipereport'

interface From {
  address: string
}
interface To {
  address: string
}
interface Email {
  text: string
  subject: string
  from: Array<From>
  to: Array<To>
}

const smtpPort: number = 1139
const outHost: string = 'localhost'
const outPort: number = 25

const mailDevSetup = logger.wrap(function mailDevSetup(): void {
  try {
    const maildev = new MailDev({
      smtp: smtpPort,
      outgoingHost: outHost,
      outgoingPort: outPort,
      silent: true,
      disableWeb: false,
    })
    maildev.on('new', (email: unknown) => {
      /**
       * When we get a new email, write the properties to environment variables.
       * Our test cases will be looking there to verify the email worked.
       */
      const newEmail = email as Email
      process.env.TEST_EMAIL_SENT_TEXT = newEmail.text
      process.env.TEST_EMAIL_SENT_SUBJECT = newEmail.subject
      process.env.TEST_EMAIL_SENT_FROM = newEmail.from[0].address
      process.env.TEST_EMAIL_SENT_TO = newEmail.to[0].address
      logger.info(`MailDev received new email: ${newEmail.subject}`)
    })
    maildev.listen()
    logger.info(
      `MailDev outgoing SMTP Server ${outHost}:${outPort} (user:undefined, pass:undefined, secure:no)`
    )
    logger.info(`MailDev webapp running at http://0.0.0.0:1080`)
    logger.info(`MailDev SMTP Server running at 0.0.0.0:${smtpPort}`)
  } catch (e) {
    logger.fatal((e as Error).message)
    process.exit(1)
  }
})

/**
 * If the file is being run directly, start the Recipe.Report API in development mode now.
 *
 * ```bash
 * ts-node src/develop.ts
 * ```
 */
if (require.main === module) {
  mailDevSetup()
  start()
}
