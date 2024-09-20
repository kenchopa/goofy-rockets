import logger from '@wgp/logger';
import { Socket } from 'socket.io';

export default function registerConnectHandler(socket: Socket) {
  logger.info(`Player "${socket.id}" connected.`);

  // TODO EMIT player connected event to rabbitmq
}
