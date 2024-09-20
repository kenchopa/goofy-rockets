import logger from '@wgp/logger';
import http from 'http';
import Koa from 'koa';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import initializeMiddleware from './middleware';
import registerSocketHandlers from './sockets';

const app = new Koa();

// Add the middleware stack
initializeMiddleware(app);

// Create HTTP server
const socketHttpServer = http.createServer(app.callback());

// Initialize Socket.IO
const socketIOServer = new SocketIOServer(socketHttpServer, {
  cors: {
    methods: ['GET', 'POST'],
    // Adjust this for security in production
    origin: '*',
  },
});

// Register socket handlers
registerSocketHandlers(socketIOServer);

// Graceful shutdown
const powerOff = () => {
  logger.info('Shutting down...');
  process.exit(0);
};

// Graceful shutdown of the server
const shutDown = (application: any, command: string) => {
  logger.info(
    `Server shutdown requested (${command}). Finishing up requests and closing down.`,
  );
  application.close(() => {
    logger.info('Successfully closed http server.');
    powerOff();
  });
};

const server = app.listen(config.APP.PORT, () => {
  logger.info(`Server listening on port "${config.APP.PORT}".`);
});

const killSignals = ['SIGTERM', 'SIGINT'] as const;
killSignals.forEach((signal) =>
  process.on(signal, () => shutDown(server, signal)),
);

// When uncaught exception occurs,
// handle the error safely as a last resort
process.on('uncaughtException', (err: Error) => {
  logger.error(err.message);
  if (server) {
    shutDown(server, 'SIGINT');
  } else {
    powerOff();
  }
});

// When uncaught promises rejections occurs,
// handle the error safely as a last resort
process.on('unhandledRejection', (reason: string) => {
  logger.crit(reason);
  if (server) {
    shutDown(server, 'SIGINT');
  } else {
    powerOff();
  }
});
