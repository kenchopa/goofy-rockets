/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/naming-convention */

import { SocketClient } from './socketClient';
import { SocketEvent } from './types/socketEvent';
import { SocketEventContainer } from './utils/socketEventContainer';
import { SocketMessageConsumer } from './utils/socketMessageConsumer';
import { SocketMessageContainer } from './utils/socketMessageContainer';

export class SocketContext {
  public readonly socketClient = new SocketClient(this);

  public readonly socketEventContainer = new SocketEventContainer();

  public readonly socketMessageContainer = new SocketMessageContainer();

  public readonly socketMessageConsumer = new SocketMessageConsumer(this);

  public readonly eventContainer = new SocketEventContainer();

  public addEvent(event: SocketEvent): boolean {
    const result = this.eventContainer.add(event);
    console.log('adding socket event', event.eventName, result);
    if (result) {
      this.socketClient.addSocketEvent(event);
      return true;
    }
    return false;
  }
}
