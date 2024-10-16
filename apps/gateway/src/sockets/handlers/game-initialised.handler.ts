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
const balanceReceivedRoutingKey = 'balance.received';
const defaultRoom = 'wgp:game:goofy-rockets:room1';

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
        socket.data.uid = uid;
        socket.data.gid = gid;
        await socket.join(defaultRoom);
        await publishMessage(
          config.RABBITMQ.EXCHANGE_WO_IN,
          gameInitialisedRoutingKey,
          payload,
        );
        logger.info(`Game "${gid}" initialised message published.`);
        socket.emit(roomsReceivedRoutingKey, {
          correlationId,
          data: {
            rooms: [{ id: defaultRoom, joined: true }],
          },
          event: roomsReceivedRoutingKey,
        });
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
