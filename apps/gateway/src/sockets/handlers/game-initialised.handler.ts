import logger from '@wgp/logger';
import { jwtDecode } from 'jwt-decode';
import { Server, Socket } from 'socket.io';

import config from '../../config';
import GameInitialisedEvent from '../../events/game-initialised.event';

type GameInitialisedPayload = {
  jwt: string;
  correlationId: string;
  socketId: string;
};

const gameInitialisedRoutingKey = 'game.initialised';

export default async function registerGameInitialisedHandler(
  server: Server,
  socket: Socket,
) {
  socket.on(
    gameInitialisedRoutingKey,
    async (payload: GameInitialisedPayload) => {
      try {
        const socketId = socket.id;
        const { jwt, correlationId } = payload;
        const { uid, gid } = jwtDecode(jwt) as { uid: string; gid: string };
        socket.data.uid = uid;
        socket.data.gid = gid;
        // await socket.join(defaultRoom);

        const gameInitialisedEvent = new GameInitialisedEvent(
          config.APP.SERVICE_NAME,
          { jwt },
          new Date(),
          { correlationId, socketId },
        );
        await gameInitialisedEvent.publish(config.RABBITMQ.EXCHANGE_WO_IN);

        logger.info(`Game "${gid}" initialised message published.`);
        // socket.emit(roomsReceivedRoutingKey, {
        //   correlationId,
        //   data: {
        //     rooms: [{ id: defaultRoom, joined: true }],
        //   },
        //   event: roomsReceivedRoutingKey,
        // });
        // socket.emit(balanceReceivedRoutingKey, {
        //   correlationId,
        //   data: {
        //     wallet: [{ amount: 100000 }],
        //   },
        //   event: balanceReceivedRoutingKey,
        // });
      } catch (error: unknown) {
        socket.emit('error.occurred', { message: (error as Error).message });
      }
    },
  );
}
