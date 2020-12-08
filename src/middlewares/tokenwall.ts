/**
 * Tokenwall middleware (like a firewall).
 * You shall not pass! Except of course if you have a token.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'

import Logger from '../services/log'
import { Responder } from '../services/responder'
import { Payload, Token } from '../services/token'
import { Cryptography } from '../services/cryptography'

export class TokenWall {
  log: Logger = new Logger()
  token: Token = new Token()
  cryptography: Cryptography = new Cryptography()
  responder: Responder = new Responder()

  public filter = (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const token: string = req.headers.token as string
      if (!token) throw new Error(`Tokenwall error. Token is required.`)
      const payload: Payload = this.token.decodeToken(token)
      if (payload.type !== `access`)
        throw new Error(`Tokenwall error. Token type is not access.`)
      const userId: string = this.cryptography.decrypt(payload.id)
      req['userId'] = userId
      next()
    } catch (error) {
      this.responder.error(_res, error.message, error.name, error)
    }
  }
}
