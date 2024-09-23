import logger from '@wgp/logger';
import { Server, Socket } from 'socket.io';

import gameLogicService from '../../services/game-logic.service';
import playerService from '../../services/player.service';

export default function registerConnectHandler(server: Server, socket: Socket) {
  playerService.addPlayer(socket.id);
  logger.info(`Player "${socket.id}" connected.`);

  // when a player connects, start the game if it's not already running
  if (!gameLogicService.isRunning()) {
    gameLogicService.startGame(server);
  }
}
