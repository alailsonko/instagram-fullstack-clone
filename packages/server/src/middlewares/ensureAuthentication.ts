import { Request, Response, NextFunction } from 'express'

import { verify } from 'jsonwebtoken'

import AppError from '../errors/AppError'

import authConfig from '../config/auth'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 403)
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, authConfig.jwt.secret)

    const { sub } = decoded as TokenPayload

    req.user = {
      id: sub
    }
    return next()
  } catch (err) {
    throw new AppError('Invalid JWT token', 403)
  }
}
