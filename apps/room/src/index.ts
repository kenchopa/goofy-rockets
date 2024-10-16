import { createAdapter } from '@socket.io/redis-streams-adapter';
import { installQueueRouter, setupRabbitMQ } from '@wgp/amqp';
import logger from '@wgp/logger';
import http from 'http';
import Koa from 'koa';
import { Server as SocketIOServer } from 'socket.io';

import config from './config';
import handleGameInitialised from './handlers/game-initialised.handler';

const startServer = async () => {
  const app = new Koa();

  // Setup RabbitMQ
  setupRabbitMQ((channel) =>
    Promise.all([
      installQueueRouter(
        channel,
        {
          exchange: 'wo-in',
          name: 'room.game-initialised',
        },
        {
          'game.initialised': handleGameInitialised,
        }
      ),
    ]),
  );

  // Graceful shutdown logic
  const powerOff = (code: number) => {
    logger.info('Shutting down...');
    process.exit(code);
  };

  // When an uncaught exception occurs
  process.on('uncaughtException', (err: Error) => {
    logger.error(err.message);
    powerOff(1);
  });

  // When uncaught promise rejections occur
  process.on('unhandledRejection', (reason: string) => {
    logger.crit(reason);
    powerOff(1);
  });
};

// Start the server and handle bootup errors
startServer().catch((error) => {
  logger.error('Error starting server:', error);
  process.exit(1);
});
