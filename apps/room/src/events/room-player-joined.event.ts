import { BaseEvent } from '@wgp/amqp';

import { Room } from '../models/room.model';

export default class RoomPlayerJoinedEvent extends BaseEvent<Room> {
  eventName = 'RoomPlayerJoined';

  routingKey = 'room.player.joined';
}
