import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import logger  from '../lib/console-logger/logger';
import { config } from '../config';
import { IncomingHttpHeaders } from 'http';
import { IContext } from '../lib/context';
import { ResponseCode, ResponseMessage } from '../common';
import { UserPayload } from '../lib/user-payload.interface';

const getHeadersToken = (
  headers: IncomingHttpHeaders,
): string | null => {
  if (headers.token) {
    return String(headers.token);
  }
  if (headers.authorization) {
    if (headers.authorization.startsWith('Bearer ')) {
      return headers.authorization.substring(7, headers.authorization.length);
    }
    return String(headers.authorization);
  }
  return null;
}
export const authenticateJWT = (
  req: IContext,
  res: Response,
  next: NextFunction
) => {
  const token = getHeadersToken(req.headers);
  if(!token) {
    return res.status(401).json({ 
      code: ResponseCode.UNAUTHORIZED, 
      message: ResponseMessage.MISSING_TOKEN 
    })
  }
  logger.info(`Verify token:${token}`);
  jwt.verify(token, config.jwtAccessSecret, (err: any, user: UserPayload) => {
    if (err) {
      logger.error(`Error: ${JSON.stringify(err)}`)
      return res.status(401).send({ 
        code: ResponseCode.UNAUTHORIZED, 
        message: ResponseMessage.TOKEN_EXPIRED 
      })
    }
    req.user = user;
    next()
  })
}
