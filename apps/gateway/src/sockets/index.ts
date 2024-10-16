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

  server.of('/').adapter.on('create-room', async (room) => {
    if (room.includes('wgp:')) {
      logger.info(`room ${room} was created`);

      const RoomCreatedRoutingKey = 'room.created';

      const payload = {
        room,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomCreatedRoutingKey,
        payload,
      );
    }
  });

  server.of('/').adapter.on('join-room', async (room, id) => {
    if (room.includes('wgp:')) {
      logger.info(`socket ${id} has joined room ${room}`);

      const socket = server.of('/').sockets.get(id);
      if (socket) {
        logger.debug('SOCKET ROOMS', socket.rooms);
      }
      const RoomPlayerJoinedRoutingKey = 'room.player-joined';

      const payload = {
        id,
        room,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomPlayerJoinedRoutingKey,
        payload,
      );
    }
  });

  server.of('/').adapter.on('leave-room', async (room, id) => {
    if (room.includes('wgp:')) {
      logger.info(`socket ${id} has left room ${room}`);

      const RoomPlayerLeftRoutingKey = 'room.player-left';

      const payload = {
        id,
        room,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomPlayerLeftRoutingKey,
        payload,
      );
    }
  });

  server.of('/').adapter.on('delete-room', async (room) => {
    if (room.includes('wgp:')) {
      logger.info(`room ${room} was deleted`);

      const RoomDeletedRoutingKey = 'room.deleted';

      const payload = {
        room,
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
