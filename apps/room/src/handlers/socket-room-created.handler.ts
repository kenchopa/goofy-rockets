import {
  getContentFromMessage,
  JSONObject,
  Message,
  publishMessage,
} from '@wgp/amqp';
import logger from '@wgp/logger';

import config from '../config';
import RoomCreatedEvent from '../events/room-created.event';
import { Room } from '../models/room.model';
import roundRepository from '../repositories/round.repository';

export default async function handleGatewayRoomCreated(
  message: Message,
): Promise<void> {
  const content = getContentFromMessage(message) as Room;

  const { gameId, roomId } = content;

  // record the room in the database
  const room = await roundRepository.createRoom(gameId, roomId, []);

  // publish the room created event
  const roomCreatedEvent = new RoomCreatedEvent(room);
  const payload = roomCreatedEvent.getPayload();
  await publishMessage(
    config.RABBITMQ.EXCHANGE_WO_INTERNAL,
    roomCreatedEvent.routingKey,
    payload as unknown as JSONObject,
  );

  logger.info(`Room created: ${roomId} for game: ${gameId}`);
}
