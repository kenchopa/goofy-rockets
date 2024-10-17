import { BaseEvent } from "@wgp/amqp";

export default class RoomPlayerJoinEvent extends BaseEvent<{ jwt: string, roomId: string }> {
  eventName = 'RoomPlayerJoin';

  routingKey = 'room.player.join';
}
