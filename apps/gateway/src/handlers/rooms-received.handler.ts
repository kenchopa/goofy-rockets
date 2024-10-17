import {
  getContentFromMessage,
  getHeadersFromMessage,
  Message,
  MessageHeaders,
} from '@wgp/amqp';
import logger from '@wgp/logger';

import { socketIOServer } from '../socket';

// type RoomsReceivedContent = {
//   gameId: string;
//   roomId: string;
//   users: string[];
//   createdAt: string;
//   updatedAt: string;
// };

const roomsReceivedRoutingKey = 'rooms.received';

export default async function handleRoomsReceived(
  message: Message,
): Promise<void> {
  const content = getContentFromMessage(message) as any;
  const { socketId, correlationId } = getHeadersFromMessage(
    message,
  ) as MessageHeaders;
  const socket = socketIOServer.of('/').sockets.get(socketId as string);
  socket?.emit(roomsReceivedRoutingKey, {
    correlationId,
    data: {
      rooms: content,
    },
    event: roomsReceivedRoutingKey,
  });
  logger.info('Rooms.received message emitted');
}
