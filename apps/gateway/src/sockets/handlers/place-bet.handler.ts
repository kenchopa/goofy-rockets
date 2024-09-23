import { Server, Socket } from 'socket.io';

import gameLogicService from '../../services/game-logic.service';
import playerService from '../../services/player.service';

export default function registerPlaceBetHandler(
  server: Server,
  socket: Socket,
) {
  socket.on('placeBet', (amount: number) => {
    if (!gameLogicService.isRunning()) {
      socket.emit('betFailed', {
        message: 'Game not running. Wait for the next round.',
      });
      return;
    }

    try {
      playerService.placeBet(socket.id, amount);
      socket.emit('betSuccess', { amount });
    } catch (error: unknown) {
      socket.emit('betFailed', { message: (error as Error).message });
    }
  });
}
