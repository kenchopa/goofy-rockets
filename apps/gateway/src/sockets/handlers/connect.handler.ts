import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

export default async function registerConnectHandler(
  server: Server,
  socket: Socket,
) {
  logger.info(`Player "${socket.id}" connected.`);
  await socket.join('wgp:room1');
}
