/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import { SocketEventResponse } from '@wgp/domain';

import { SocketContext } from '../socketContext';

export abstract class SocketEvent {
  public readonly context: SocketContext;

  public readonly eventName: string;

  constructor(context: SocketContext, eventName: string) {
    this.context = context;
    this.eventName = eventName;
  }

  public abstract handler(...args: SocketEventResponse[]): void;
}
