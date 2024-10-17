/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import { type SocketEvent } from '../types/socketEvent';

export class SocketEventContainer {
  public readonly socketEvents: SocketEvent[] = [];

  public add(event: SocketEvent): boolean {
    if (this.has(event.eventName)) {
      return false;
    }
    this.socketEvents.push(event);
    return true;
  }

  public remove(eventName: string): SocketEvent | undefined {
    const index = this.socketEvents.findIndex((v) => v.eventName === eventName);
    if (index < 0) {
      return;
    }
    const event = this.socketEvents.splice(index, 1)[0];
    return event;
  }

  public has(eventName: string): boolean {
    return !!this.socketEvents.find((v) => v.eventName === eventName);
  }
}
