import { BaseEvent } from '@wgp/amqp';

export default class GameInitialisedEvent extends BaseEvent<{ jwt: string }> {
  eventName = 'GameInitialised';

  routingKey = 'game.initialised';
}
