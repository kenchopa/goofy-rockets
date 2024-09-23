import { Server, Socket } from 'socket.io';

import gameLogicService from '../../services/game-logic.service';
import playerService from '../../services/player.service';

export default function registerCashOutHandler(server: Server, socket: Socket) {
  socket.on('cashOut', () => {
    try {
      const payout = playerService.cashOut(
        socket.id,
        gameLogicService.getCurrentMultiplier(),
      );
      socket.emit('cashOutSuccess', { payout });
    } catch (error: unknown) {
      socket.emit('cashOutFailed', { message: (error as Error).message });
    }
  });
}
