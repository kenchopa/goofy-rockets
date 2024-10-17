import { installQueueRouter, setupRabbitMQ } from '@wgp/amqp';
import logger from '@wgp/logger';
import Koa from 'koa';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import redisClient, { connectRedis } from './infrastructure/redis.client';
import initializeMiddleware from './middleware';
import registerSocketHandlers from './sockets';
import { createServer } from './server';
import { createSocketServer } from './socket';
import handleRoomsReceived from './handlers/rooms-received.handler';

const startServer = async () => {
  const app = new Koa();

  // Add the middleware stack
  initializeMiddleware(app);

  // Setup Redis
  try {
    await connectRedis();
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    process.exit(1); // Exit the process if Redis connection fails
  }

  // Setup RabbitMQ
  await setupRabbitMQ((channel) =>
    Promise.all([
      installQueueRouter(
        channel,
        {
          exchange: 'wo-out',
          name: 'rooms.received',
        },
        {
          'rooms.received': handleRoomsReceived,
        },
      ),
    ]),
  );

  const server = createServer(app);

  const socketIOServer = createSocketServer(server, redisClient);

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
