/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { socketEventNames } from '@wgp/domain';

import { SocketContext } from '../socketContext';
import { SocketEvent } from '../types/socketEvent';

export class GameInitializedEvent implements SocketEvent {
  constructor(public readonly context: SocketContext) { }

  public get id(): string {
    return socketEventNames.game.initialised;
  }

  public handler(...args: unknown[]): void {
    console.log('game initialized', args);
    this.context.socketMessageConsumer.consumeMessage(args);
  }
}
