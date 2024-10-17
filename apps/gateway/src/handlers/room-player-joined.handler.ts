import {
  getContentFromMessage,
  getHeadersFromMessage,
  Message,
  MessageHeaders,
} from '@wgp/amqp';
import logger from '@wgp/logger';

import { socketIOServer } from '../socket';

const roomPlayerJoinedRoutingKey = 'room.player.joined';

export default async function handleRoomPlayerJoined(
  message: Message,
): Promise<void> {
  const content = getContentFromMessage(message) as any;
  const { socketId, correlationId } = getHeadersFromMessage(
    message,
  ) as MessageHeaders;
  const socket = socketIOServer.of('/').sockets.get(socketId as string);
  socket?.emit(roomPlayerJoinedRoutingKey, {
    correlationId,
    data: {
      room: content,
    },
    event: roomPlayerJoinedRoutingKey,
  });
  logger.info('Rooms.player.joined message emitted');
}
