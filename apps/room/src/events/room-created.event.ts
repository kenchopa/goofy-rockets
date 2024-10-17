import { BaseEvent } from '@wgp/amqp';

import { Room } from '../models/room.model';

export default class RoomCreatedEvent extends BaseEvent<Room> {
  eventName = 'RoomCreated';

  routingKey = 'room.room-created';
}
