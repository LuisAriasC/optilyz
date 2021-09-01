/* eslint-disable import/first */
import { createHttpTerminator } from 'http-terminator';
import util from 'util';

import app from './app';
import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './lib/console-logger/logger';
import { config } from './config';
import { handle } from './lib/process-error';

process.on('unhandledRejection', err => { throw err; });

process.on('uncaughtException', err => { handle(err); });

const PORT = config.port || 3000;

let debugCallback = null;
if (config.env === 'development') {
  debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    });
  };
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: config.mongoUrl,
  debugCallback,
  onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) => logger.log({
    level: 'error',
    message: `Could not connect to MongoDB at ${mongoUrl}`,
    error
  }),
  onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
});

export const initServer = () => app.listen(config.port, () => {
  logger.info(`Started server on port:${config.port} in ${config.env} mode`);
});

/** Safetly connect to MongoDB */
safeMongooseConnection.connect(mongoUrl => {
  logger.info(`Connected to MongoDB at ${mongoUrl}`);
  const server = initServer();

  /** Terminate server gracefully with 3 seconds of termination */
  const httpTerminator = createHttpTerminator({
    gracefulTerminationTimeout: 3000,
    server
  });

  const shutdownSignals = ['SIGTERM', 'SIGINT'];

  shutdownSignals.forEach(
    signal => process.on(signal, async () => {
      console.log('\n'); /* eslint-disable-line */
      logger.info(`${signal} received, gracefully shutting down`);
      logger.info('Closing the MongoDB connection');
      safeMongooseConnection.close(err => {
        if (err) {
          logger.log({
            level: 'error',
            message: 'Error shutting closing mongo connection',
            error: err
          });
        } else {
          logger.info('Mongo connection closed successfully');
        }
      }, true);
      /** Terminate sercer gracefully */
      await httpTerminator.terminate();
    })
  );
});
