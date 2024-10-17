import { BaseEvent } from '@wgp/domain';

import { Room } from '../models/room.model';

export default class RoomCreatedEvent extends BaseEvent<Room> {
  eventName = 'RoomCreated';

  routingKey = 'room.room-created';
}
