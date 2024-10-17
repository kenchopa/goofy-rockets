import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-streams-adapter';
import { Server } from 'http';
import { RedisClientType } from 'redis';

let socketIOServer: SocketIOServer;

const createSocketServer = (server: Server, redisClient: RedisClientType) => {
  // Initialize Socket.IO with Redis Streams Adapter
  socketIOServer = new SocketIOServer(server, {
    adapter: createAdapter(redisClient),
    cors: {
      methods: ['GET', 'POST'],
      origin: '*', // Adjust this for security in production
    },
  });
  return socketIOServer;
};

export {
    socketIOServer,
    createSocketServer,
  };
  
