import { createAdapter } from '@socket.io/redis-streams-adapter';
import logger from '@wgp/logger';
import http from 'http';
import Koa from 'koa';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import redisClient, { connectRedis } from './infrastructure/redis.client';
import initializeMiddleware from './middleware';
import registerSocketHandlers from './sockets';

const startServer = async () => {
  const app = new Koa();

  // Add the middleware stack
  initializeMiddleware(app);

  try {
    await connectRedis();
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    process.exit(1); // Exit the process if Redis connection fails
  }

  // Create a single HTTP server
  const server = http.createServer(app.callback());

  // Initialize Socket.IO with Redis Streams Adapter
  const socketIOServer = new SocketIOServer(server, {
    adapter: createAdapter(redisClient),
    cors: {
      methods: ['GET', 'POST'],
      origin: '*', // Adjust this for security in production
    },
  });

  // Register socket handlers
  registerSocketHandlers(socketIOServer);

  // Start the unified HTTP and Socket.IO server
  server.listen(config.APP.PORT, () => {
    logger.info(`Server listening on port "${config.APP.PORT}".`);
  });

  // Graceful shutdown logic
  const powerOff = () => {
    logger.info('Shutting down...');
    process.exit(0);
  };

  const shutDown = (
    application: any,
    socketServer: SocketIOServer,
    command: string,
  ) => {
    logger.info(
      `Server shutdown requested (${command}). Finishing up requests and closing down.`,
    );

    // Close the HTTP server
    application.close(() => {
      logger.info('Successfully closed HTTP server.');

      // Close the Socket.IO server
      socketServer.close(() => {
        logger.info('Successfully closed Socket.IO server.');
        powerOff();
      });
    });
  };

  // Gracefully handle termination signals
  const killSignals = ['SIGTERM', 'SIGINT'] as const;
  killSignals.forEach((signal) =>
    process.on(signal, () => shutDown(server, socketIOServer, signal)),
  );

  // When an uncaught exception occurs
  process.on('uncaughtException', (err: Error) => {
    logger.error(err.message);
    if (server && socketIOServer) {
      shutDown(server, socketIOServer, 'SIGINT');
    } else {
      powerOff();
    }
  });

  // When uncaught promise rejections occur
  process.on('unhandledRejection', (reason: string) => {
    logger.crit(reason);
    if (server && socketIOServer) {
      shutDown(server, socketIOServer, 'SIGINT');
    } else {
      powerOff();
    }
  });
};

// Start the server and handle bootup errors
startServer().catch((error) => {
  logger.error('Error starting server:', error);
  process.exit(1);
});
