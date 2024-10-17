import {
  getContentFromMessage,
  getHeadersFromMessage,
  Message,
  MessageHeaders,
} from '@wgp/amqp';
import { randomUUID } from 'crypto';
import { jwtDecode } from 'jwt-decode';

import config from '../config';
import RoomPlayerJoinedEvent from '../events/room-player-joined.event';
import roomRepository from '../repositories/room.repository';

type RoomPlayerJoinContent = {
  jwt: string;
  roomId: string;
};

export default async function handleRoomPlayerJoin(
  message: Message,
): Promise<void> {
  const content = getContentFromMessage(message) as RoomPlayerJoinContent;
  const headers = getHeadersFromMessage(message) as MessageHeaders;

  const { jwt, roomId } = content;
  const { uid: userId } = jwtDecode(jwt) as { uid: string };

  // find room and add user
  const room = await roomRepository.getRoomById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }
  await roomRepository.addUserToRoom(roomId, userId);

  // publish the room player joined event to wo-out
  const roomPlayerJoinedEvent = new RoomPlayerJoinedEvent(
    config.APP.SERVICE_NAME,
    room,
    new Date(),
    headers,
  );
  await roomPlayerJoinedEvent.publish(config.RABBITMQ.EXCHANGE_WO_OUT);
}
