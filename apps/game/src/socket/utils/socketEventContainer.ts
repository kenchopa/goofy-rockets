/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import { type SocketEvent } from '../types/socketEvent';

export class SocketEventContainer {
  public readonly socketEvents: SocketEvent[] = [];

  public events: {
    onRemove: (event: SocketEvent) => void;
    onAdd: (event: SocketEvent) => void;
  } = {
    onAdd: _.noop.bind(undefined),
    onRemove: _.noop.bind(undefined),
  };

  public add(event: SocketEvent): boolean {
    if (this.has(event.id)) {
      return false;
    }
    this.socketEvents.push(event);
    return true;
  }

  public remove(eventId: string): SocketEvent | undefined {
    const index = this.socketEvents.findIndex((v) => v.id === eventId);
    if (index < 0) {
      return;
    }
    return this.socketEvents.splice(index, 1)[0];
  }

  public has(eventId: string): boolean {
    return !!this.socketEvents.find((v) => v.id === eventId);
  }
}
