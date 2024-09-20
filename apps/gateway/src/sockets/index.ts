import { Server, Socket } from 'socket.io';

import registerConnectHandler from './handlers/connect.handler';
import registerDisconnectHandler from './handlers/disconnect.handler';

const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    registerConnectHandler(socket);
    registerDisconnectHandler(socket);
  });
};

export default registerSocketHandlers;
