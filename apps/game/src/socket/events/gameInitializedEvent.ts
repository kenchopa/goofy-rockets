/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { socketEvents } from '../constants/socketEvents';
import { SocketContext } from '../socketContext';
import { SocketEvent } from '../types/socketEvent';

export class GameInitializedEvent implements SocketEvent {
  constructor(public readonly context: SocketContext) {}

  public get id(): string {
    return socketEvents.game.initialized;
  }

  public handler(...args: unknown[]): void {
    console.log('game initialized', args);
    this.context.socketMessageConsumer.consumeMessage(args);
  }
}
