import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

import playerService from '../../services/player.service';

export default function registerDisconnectHandler(
  server: Server,
  socket: Socket,
) {
  socket.on('disconnect', () => {
    playerService.removePlayer(socket.id);
    logger.info(`Player "${socket.id}" disconnected.`);
  });
}
