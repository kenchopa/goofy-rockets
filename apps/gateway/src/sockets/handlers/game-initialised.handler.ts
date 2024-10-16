import { publishMessage } from '@wgp/amqp';
import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

import config from '../../config';

type GameInitialisedPayload = {
  gameId: string;
};

const GameInitialisedRoutingKey = 'game.initialised';

export default function registerGameInitialisedHandler(
  server: Server,
  socket: Socket,
) {
  socket.on(
    GameInitialisedRoutingKey,
    async (payload: GameInitialisedPayload) => {
      try {
        socket.join('room1');
        await publishMessage(
          config.RABBITMQ.EXCHANGE_WO_IN,
          GameInitialisedRoutingKey,
          payload,
        );
        logger.info(`Game "${payload.gameId}" initialised message published.`);
      } catch (error: unknown) {
        socket.emit('error.occurred', { message: (error as Error).message });
      }
    },
  );
}
