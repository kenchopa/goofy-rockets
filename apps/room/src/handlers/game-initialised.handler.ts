import {
  getContentFromMessage,
  getHeadersFromMessage,
  Message,
  MessageHeaders,
} from '@wgp/amqp';
import { randomUUID } from 'crypto';
import { jwtDecode } from 'jwt-decode';

import config from '../config';
import RoomCreatedEvent from '../events/room-created.event';
import RoomsReceivedEvent from '../events/rooms-received.event';
import roundRepository from '../repositories/round.repository';

type GameInitialisedContent = {
  jwt: string;
};

const ROOMID_KEY = 'wgp:{gameId}:{roomId}';

export default async function handleGameInitialised(
  message: Message,
): Promise<void> {
  const content = getContentFromMessage(message) as GameInitialisedContent;
  const headers = getHeadersFromMessage(message) as MessageHeaders;

  const { jwt } = content;
  const { gid: gameId } = jwtDecode(jwt) as { gid: string };

  let roomId = ROOMID_KEY.replace('{gameId}', gameId);
  roomId = roomId.replace('{roomId}', randomUUID());

  // when a game is initialised, we try to get the first room for the game
  // for now, we only support one room per game
  const rooms = await roundRepository.getRoomsByGameId(gameId);
  if (rooms.length > 0) {
    const room = rooms[0]; // for now, we only support one room per game
    const roomsReceivedEvent = new RoomsReceivedEvent(
      config.APP.SERVICE_NAME,
      [room],
      new Date(),
      headers,
    );
    await roomsReceivedEvent.publish(config.RABBITMQ.EXCHANGE_WO_OUT);
    return;
  }

  // when no room is found, we create a new room
  const room = await roundRepository.createRoom(gameId, roomId, []);
  const roomCreatedEvent = new RoomCreatedEvent(
    config.APP.SERVICE_NAME,
    room,
    new Date(),
    headers,
  );
  // publish the room created event to wo-internal
  await roomCreatedEvent.publish(config.RABBITMQ.EXCHANGE_WO_INTERNAL);

  // publish the rooms received event to wo-out
  const roomsReceivedEvent = new RoomsReceivedEvent(
    config.APP.SERVICE_NAME,
    [room],
    new Date(),
    headers,
  );
  await roomsReceivedEvent.publish(config.RABBITMQ.EXCHANGE_WO_OUT);
}
