/**
 * Logger service.
 * General logging of anything interesting.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

interface Transcriptionist {
  write(string: string): void
}

class Logger implements Transcriptionist {
  public write(string: string): void {
    // https://xkcd.com/1179/
    const timestamp: string = new Date().toISOString()
    console.log(`${timestamp} | ${string}`)
  }
}

export default Logger
