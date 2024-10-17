import { BaseEvent } from '@wgp/amqp';

import { Room } from '../models/room.model';

export default class RoomsReceivedEvent extends BaseEvent<Room[]> {
  eventName = 'RoomsReceived';

  routingKey = 'rooms.received';
}
