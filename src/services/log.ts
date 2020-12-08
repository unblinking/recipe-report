/**
 * Logger service.
 * General logging of anything interesting.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/**
 * Interface for the general logger service.
 *
 * @interface Transcriptionist
 */
interface Transcriptionist {
  /**
   * Write to the general log.
   *
   * @param {string} string
   * @memberof Transcriptionist
   */
  write(string: string): void
}

/**
 * General logging service.
 *
 * @class Logger
 * @implements {Transcriptionist}
 */
class Logger implements Transcriptionist {
  /**
   * Write to the general log.
   *
   * @memberof Logger
   */
  public write = (string: string): void => {
    // https://xkcd.com/1179/
    const timestamp: string = new Date().toISOString()
    console.log(`${timestamp} | ${string}`)
  }
}

export default Logger
