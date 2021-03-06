import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import pino from 'pino';

export const logger = pino({
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
});

export const handle = pino.final(logger, (err, finalLogger) => {
    finalLogger.fatal(err);
    process.exitCode = 1;
    process.kill(process.pid, 'SIGTERM');
});

export const notFoundMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next(boom.notFound('The requested resource does not exist.'));
};

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        output: { payload: error, statusCode },
    } = boom.boomify(err);

    res.status(statusCode).json({ error });
    if (statusCode >= 500) {
        handle(err);
  }
};
