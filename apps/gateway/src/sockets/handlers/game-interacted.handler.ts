import { publishMessage } from '@wgp/amqp';
import logger from '@wgp/logger';
import { jwtDecode } from 'jwt-decode';
import { Server, Socket } from 'socket.io';

import config from '../../config';

type GameInteractedPayload = {
  jwt: string;
  correlationId: string;
};

const gameInteractedRoutingKey = 'game.interacted';
const balanceReceivedRoutingKey = 'balance.received';

export default async function registerGameInitialisedHandler(
  server: Server,
  socket: Socket,
) {
  socket.on(
    gameInteractedRoutingKey,
    async (payload: GameInteractedPayload) => {
      try {
        const { jwt, correlationId } = payload;
        const { gid } = jwtDecode(jwt) as { uid: string; gid: string };
        await publishMessage(
          config.RABBITMQ.EXCHANGE_WO_IN,
          gameInteractedRoutingKey,
          payload,
        );
        logger.info(`Game "${gid}" interacted message published.`);
        socket.emit(balanceReceivedRoutingKey, {
          correlationId,
          data: {
            wallet: [{ amount: 100000 }],
          },
          event: balanceReceivedRoutingKey,
        });
      } catch (error: unknown) {
        socket.emit('error.occurred', { message: (error as Error).message });
      }
    },
  );
}
