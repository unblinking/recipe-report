/**
 * Recipe.Report development mode.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** External imports. */
import MailDev from 'maildev'
/** Internal imports. */
import Logger from './services/logger'
import RecipeReport from './recipereport'

/**
 * MailDev email server.
 *
 * @class DevEmailServer
 */
class DevEmailServer {
  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof DevEmailServer
   */
  private logger: Logger = new Logger()

  /**
   * Configure and start the MailDev email server.
   *
   * @public
   * @memberof DevEmailServer
   */
  public setup = (): void => {
    const smtpPort: number = 1139
    const outHost: string = 'localhost'
    const outPort: number = 25
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
        const newEmail = email as Email
        process.env.TEST_EMAIL_SENT_TEXT = newEmail.text
        process.env.TEST_EMAIL_SENT_SUBJECT = newEmail.subject
        process.env.TEST_EMAIL_SENT_FROM = newEmail.from[0].address
        process.env.TEST_EMAIL_SENT_TO = newEmail.to[0].address
        this.logger.write(`MailDev received new email: ${newEmail.subject}`)
      })
      maildev.listen()
      this.logger.write(
        `MailDev outgoing SMTP Server ${outHost}:${outPort} (user:undefined, pass:undefined, secure:no)`
      )
      this.logger.write(`MailDev webapp running at http://0.0.0.0:1080`)
      this.logger.write(`MailDev SMTP Server running at 0.0.0.0:${smtpPort}`)
    } catch (ex) {
      this.logger.write(ex)
      process.exit(1)
    }
  }
}

/**
 * If the file is being run directly, start the Recipe.Report API in development mode now.
 *
 * ```bash
 * ts-node src/develop.ts
 * ```
 */
if (require.main === module) {
  const devEmailServer = new DevEmailServer()
  devEmailServer.setup()

  const recipeReport = new RecipeReport()
  recipeReport.start()
}
