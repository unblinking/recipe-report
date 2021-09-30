/**
 * Tokenwall middleware (like a firewall).
 * You shall not pass! Except of course if you have a token.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

import { Request, Response, NextFunction } from 'express'

import { logger } from '../wrappers/log'
import { Payload, decodeToken, tokenType } from '../wrappers/token'
import { Responder } from '../services/responder-service'

interface RequestWithUser extends Request {
  userId?: string
}

export const tokenwall = (
  req: RequestWithUser,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token: string = req.headers.token as string
    if (!token) throw new Error(`Token is required in req.headers.token.`)
    const payload: Payload = decodeToken(token)

    // Verify that the tokne is for access.
    if (payload.type !== tokenType.ACCESS)
      throw new Error(
        `Token type is not access. Try again using a valid access token.`
      )

    // Verify that the token hasn't expired.
    const now = new Date().getTime()
    if (payload.ttl < now) throw new Error(`Token expired.`)

    // Add the user Id from the payload to the request.
    const userId: string = payload.id
    req.userId = userId

    // Allow the request to continue on.
    next()
  } catch (e) {
    logger.error(`Tokenwall error. ${(e as Error).message}`)
    const data = {
      errorName: `401 Unauthorized`,
      errorMessage: (e as Error).message,
    }
    const responder: Responder = new Responder(401)
    responder.fail(_res, data)
  }
}
