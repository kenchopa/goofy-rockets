/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { socketEventNames, SocketEventResponse } from '@wgp/domain';

import { SocketContext } from '../socketContext';
import { SocketEvent } from '../types/socketEvent';

export class GameInitializedEvent extends SocketEvent {
  constructor(context: SocketContext) {
    super(context, socketEventNames.game.initialised);
  }

  public handler(...args: SocketEventResponse[]): void {
    console.log(this.eventName, args);
    args.forEach((v) => this.context.socketMessageConsumer.consumeMessage(v));
  }
}
