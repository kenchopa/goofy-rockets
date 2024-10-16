import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

export default function registerDisconnectHandler(
  server: Server,
  socket: Socket,
) {
  socket.on('disconnect', () => {
    logger.info(`Player "${socket.id}" disconnected.`);
  });
}
