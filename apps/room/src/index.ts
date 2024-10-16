import { installQueueRouter, setupRabbitMQ } from '@wgp/amqp';
import logger from '@wgp/logger';
import { connectMongoDB } from '@wgp/mongodb';
import Koa from 'koa';

import config from './config';
import handleGameInitialised from './handlers/game-initialised.handler';
import handleGatewayRoomCreated from './handlers/gateway-room-created.handler';
import initializeMiddleware from './middleware';

const startServer = async () => {
  const app = new Koa();

  // Add the middleware stack
  initializeMiddleware(app);

  // Setup MongoDB
  await connectMongoDB({
    db: config.MONGODB.DB,
    host: config.MONGODB.HOST,
    password: config.MONGODB.PASSWORD,
    port: config.MONGODB.PORT,
    user: config.MONGODB.USER,
  });

  // Setup RabbitMQ
  await setupRabbitMQ((channel) =>
    Promise.all([
      installQueueRouter(
        channel,
        {
          exchange: 'wo-in',
          name: 'room.game-initialised',
        },
        {
          'game.initialised': handleGameInitialised,
        },
      ),
      installQueueRouter(
        channel,
        {
          exchange: 'wo-in',
          name: 'room.gateway-room-created',
        },
        {
          'room.created': handleGatewayRoomCreated,
        },
      ),
    ]),
  );

  // Create a HTTP server
  const server = app.listen(config.APP.PORT, () => {
    logger.info(`Server listening on port "${config.APP.PORT}".`);
  });

  // Graceful shutdown logic
  const powerOff = () => {
    logger.info('Shutting down...');
    process.exit(0);
  };

  const shutDown = (application: any, command: string) => {
    logger.info(
      `Server shutdown requested (${command}). Finishing up requests and closing down.`,
    );

    // Close the HTTP server
    application.close(() => {
      logger.info('Successfully closed HTTP server.');
      powerOff();
    });
  };

  // Gracefully handle termination signals
  const killSignals = ['SIGTERM', 'SIGINT'] as const;
  killSignals.forEach((signal) =>
    process.on(signal, () => shutDown(server, signal)),
  );

  // When an uncaught exception occurs
  process.on('uncaughtException', (err: Error) => {
    logger.error(err.message);
    if (server) {
      shutDown(server, 'SIGINT');
    } else {
      powerOff();
    }
  });

  // When uncaught promise rejections occur
  process.on('unhandledRejection', (reason: string) => {
    logger.crit(reason);
    if (server) {
      shutDown(server, 'SIGINT');
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
