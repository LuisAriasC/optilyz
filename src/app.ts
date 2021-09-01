import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import ApplicationError from './errors/application-error';
import routes from './routes';
import logger from './lib/console-logger/logger';
import { ModuleConfig } from './lib/module/module.config';
import { UserModule } from './modules/user';
import { TaskModule } from './modules/task';
import { AuthModule } from './modules/auth';

const modules: Array<ModuleConfig> = [];

/** Build new express app */
const app = express();

/** Middleware to check response times */
function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' }
    });
  });

  next();
}

app.use(logResponseTime);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Add routes with modules */
modules.push(new UserModule());
modules.push(new TaskModule());
modules.push(new AuthModule());
modules.forEach((module: ModuleConfig) => {
  module.configureRoutes(app);
});

modules.forEach((module: ModuleConfig) => {
  logger.info(`Routes configured for module ${module.name}`);
});

app.use(routes);

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: err.message
  });
});

export default app;
