import { Server, Socket } from 'socket.io';

import registerCashOutHandler from './handlers/cash-out.handler';
import registerConnectHandler from './handlers/connect.handler';
import registerDisconnectHandler from './handlers/disconnect.handler';
import registerPlaceBetHandler from './handlers/place-bet.handler';

const registerSocketHandlers = (server: Server) => {
  server.on('connection', (socket: Socket) => {
    registerConnectHandler(server, socket);
    registerDisconnectHandler(server, socket);
    registerPlaceBetHandler(server, socket);
    registerCashOutHandler(server, socket);
  });
};

export default registerSocketHandlers;
