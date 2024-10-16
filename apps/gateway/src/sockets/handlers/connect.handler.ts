import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

export default function registerConnectHandler(server: Server, socket: Socket) {
  logger.info(`Player "${socket.id}" connected.`);
  socket.join('wgp:room1');
}
