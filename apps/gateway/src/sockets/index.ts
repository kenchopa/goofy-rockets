import { Server, Socket } from 'socket.io';

import { publishMessage } from '@wgp/amqp';

import config from '../config';

import registerConnectHandler from './handlers/connect.handler';
import registerDisconnectHandler from './handlers/disconnect.handler';
import registerGameInitialisedHandler from './handlers/game-initialised.handler';

const registerSocketHandlers = (server: Server) => {
  server.on('connection', (socket: Socket) => {
    registerConnectHandler(server, socket);
    registerDisconnectHandler(server, socket);
    registerGameInitialisedHandler(server, socket);
  });

  server.of("/").adapter.on("create-room", async (room) => {
    if (room.includes('wgp:')) {
      console.log(`room ${room} was created`);

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
  
  server.of("/").adapter.on("join-room", async (room, id) => {
    if (room.includes('wgp:')) {
      console.log(`socket ${id} has joined room ${room}`);

      const RoomPlayerJoinedRoutingKey = 'room.player-joined';

      const payload = {
        room,
        id,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomPlayerJoinedRoutingKey,
        payload,
      );
    }
  });

  server.of("/").adapter.on("leave-room", async (room, id) => {
    if (room.includes('wgp:')) {
      console.log(`socket ${id} has left room ${room}`);

      const RoomPlayerLeftRoutingKey = 'room.player-left';

      const payload = {
        room,
        id,
      };

      await publishMessage(
        config.RABBITMQ.EXCHANGE_WO_IN,
        RoomPlayerLeftRoutingKey,
        payload,
      );
    }
  });

  server.of("/").adapter.on("delete-room", async (room) => {
    if (room.includes('wgp:')) {
      console.log(`room ${room} was deleted`);

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
