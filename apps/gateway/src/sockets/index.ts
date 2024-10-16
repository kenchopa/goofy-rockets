import { publishMessage } from '@wgp/amqp';
import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

import config from '../config';
import registerConnectHandler from './handlers/connect.handler';
import registerDisconnectHandler from './handlers/disconnect.handler';
import registerGameInitialisedHandler from './handlers/game-initialised.handler';

const registerSocketHandlers = (server: Server) => {
  server.on('connection', async (socket: Socket) => {
    await registerConnectHandler(server, socket);
    await registerDisconnectHandler(server, socket);
    await registerGameInitialisedHandler(server, socket);
  });

  server.of('/').adapter.on('create-room', async (roomId) => {
    if (roomId.includes('wgp:')) {
      const parts = roomId.split(':');
      logger.info(`room ${roomId} was created`);

      const RoomCreatedRoutingKey = 'room.created';

      const gameId = parts[2];
      const payload = {
        gameId,
        roomId,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomCreatedRoutingKey,
        payload,
      );
    }
  });

  server.of('/').adapter.on('join-room', async (roomId, socketId) => {
    if (roomId.includes('wgp:')) {
      logger.info(`socket ${socketId} has joined room ${roomId}`);

      const { uid, gid } = server.sockets.sockets.get(socketId) as any;

      const RoomPlayerJoinedRoutingKey = 'room.player-joined';

      const payload = {
        gameId: gid,
        playerId: uid,
        roomId,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomPlayerJoinedRoutingKey,
        payload,
      );
    }
  });

  server.of('/').adapter.on('leave-room', async (roomId, socketId) => {
    if (roomId.includes('wgp:')) {
      logger.info(`socket ${socketId} has left room ${roomId}`);

      const { uid, gid } = server.sockets.sockets.get(socketId) as any;

      const RoomPlayerLeftRoutingKey = 'room.player-left';

      const payload = {
        gameId: gid,
        playerId: uid,
        roomId,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomPlayerLeftRoutingKey,
        payload,
      );
    }
  });

  server.of('/').adapter.on('delete-room', async (roomId) => {
    if (roomId.includes('wgp:')) {
      const parts = roomId.split(':');
      logger.info(`room ${roomId} was deleted`);

      const RoomDeletedRoutingKey = 'room.deleted';

      const gameId = parts[2];
      const payload = {
        gameId,
        roomId,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomDeletedRoutingKey,
        payload,
      );
    }
  });
};

export default registerSocketHandlers;
