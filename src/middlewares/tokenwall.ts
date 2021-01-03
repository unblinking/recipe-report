/**
 * Tokenwall middleware (like a firewall).
 * You shall not pass! Except of course if you have a token.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'

import { logger } from '../wrappers/log'
import { Payload, decodeToken, tokenType } from '../wrappers/token'
import { decrypt } from '../wrappers/cryptography'
import { Responder } from '../services/responder-service'

export const tokenwall = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token: string = req.headers.token as string
    if (!token) throw new Error(`Token is required in req.headers.token.`)
    const payload: Payload = decodeToken(token)
    if (payload.type !== tokenType.ACCESS)
      throw new Error(
        `Token type is not access. Try again using a valid access token.`
      )
    const userId: string = decrypt(payload.id)
    req['userId'] = userId
    next()
  } catch (error) {
    logger.error(`Tokenwall error. ${error.message}`)
    const data = {
      errorName: `401 Unauthorized`,
      errorMessage: error.message,
    }
    const responder: Responder = new Responder(401)
    responder.fail(_res, data)
  }
}
