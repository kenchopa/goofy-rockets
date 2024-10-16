import { publishMessage } from '@wgp/amqp';
import logger from '@wgp/logger';
import { jwtDecode } from 'jwt-decode';
import { Server, Socket } from 'socket.io';

import config from '../../config';

type GameInitialisedPayload = {
  jwt: string;
  correlationId: string;
};

const gameInitialisedRoutingKey = 'game.initialised';
const roomsReceivedRoutingKey = 'rooms.received';
const defaultRoom = 'wgp:room1';

export default async function registerGameInitialisedHandler(
  server: Server,
  socket: Socket,
) {
  socket.on(
    gameInitialisedRoutingKey,
    async (payload: GameInitialisedPayload) => {
      try {
        const { jwt, correlationId } = payload;
        const { uid, gid } = jwtDecode(jwt) as { uid: string; gid: string };
        await socket.join(defaultRoom);
        await socket.join(uid);
        await publishMessage(
          config.RABBITMQ.EXCHANGE_WO_IN,
          gameInitialisedRoutingKey,
          payload,
        );
        logger.info(`Game "${gid}" initialised message published.`);
        socket.emit(roomsReceivedRoutingKey, {
          correlationId,
          data: {
            rooms: [{ id: 'wgp:room1', joined: true }],
          },
          event: roomsReceivedRoutingKey,
        });
      } catch (error: unknown) {
        socket.emit('error.occurred', { message: (error as Error).message });
      }
    },
  );
}
