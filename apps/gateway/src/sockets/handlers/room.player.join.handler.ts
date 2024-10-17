import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

import config from '../../config';
import RoomPlayerJoinEvent from '../../events/room-player-join.event';

type RoomPlayerJoinPayload = {
  jwt: string;
  correlationId: string;
  roomId: string;
};

const roomPlayerJoinRoutingKey = 'room.player.join';

export default async function registerRoomPlayerJoinHandler(
  server: Server,
  socket: Socket,
) {
  socket.on(
    roomPlayerJoinRoutingKey,
    async (payload: RoomPlayerJoinPayload) => {
      try {
        const socketId = socket.id;
        const { jwt, correlationId, roomId } = payload;
        const { uid, gid } = socket.data;

        const roomPlayerJoin = new RoomPlayerJoinEvent(
          config.APP.SERVICE_NAME,
          { jwt, roomId },
          new Date(),
          { correlationId, socketId },
        );
        await roomPlayerJoin.publish(config.RABBITMQ.EXCHANGE_WO_IN);

        logger.info(`Room "${roomId}" Player ${uid} join message published.`);
      } catch (error: unknown) {
        socket.emit('error.occurred', { message: (error as Error).message });
      }
    },
  );
}
