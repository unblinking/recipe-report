/**
 * Fun service.
 * Playful frivolity.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/** Internal imports. */
import Logger from './logger'

/**
 * Some fun stuff.
 *
 * @class Fun
 */
class Fun {
  /**
   * General logging service.
   *
   * @private
   * @type {Logger}
   * @memberof Fun
   */
  private logger: Logger = new Logger()

  /**
   * The version of this application from the package.json file.
   *
   * @private
   * @type {string}
   * @memberof Fun
   */
  private version: string = process.env.npm_package_version ?? 'unknown'

  /**
   * Some graffiti to tag the logs with.
   *
   * @private
   * @type {string}
   * @memberof Fun
   */
  private graffiti: string = `\x1b[1m\x1b[32m
     ____           _
    |  _ \\ ___  ___(_)_ __   ___
    | |_) / _ \\/ __| | '_ \\ / _ \\
    |  _ <  __/ (__| | |_) |  __/
    |_|_\\_\\___|\\___|_| .__/ \\___|
    |  _ \\ ___ _ __  |_|_  _ __| |_
    | |_) / _ \\ '_ \\ / _ \\| '__| __|
    |  _ <  __/ |_) | (_) | |  | |_
    |_| \\_\\___| .__/ \\___/|_|   \\__|
    \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${this.version}
    \x1b[0m`

  /**
   * Tag the logs with the specified graffiti.
   *
   * @returns {Promise<string>}
   * @memberof Fun
   */
  public tag = (): Promise<string> => {
    const promise: Promise<string> = new Promise((resolve) => {
      this.logger.write(this.graffiti)
      resolve()
    })
    return promise
  }
}

export default Fun
