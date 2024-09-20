import logger from '@wgp/logger';
import { Socket } from 'socket.io';

export default function registerDisconnectHandler(socket: Socket) {
  socket.on('disconnect', () => {
    logger.info(`Player "${socket.id}" disconnected.`);

    // TODO EMIT player connected event to rabbitmq
  });
}
