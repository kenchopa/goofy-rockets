/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/naming-convention */

import { SocketClient } from './socketClient';
import { SocketEventContainer } from './utils/socketEventContainer';
import { SocketMessageConsumer } from './utils/socketMessageConsumer';
import { SocketMessageContainer } from './utils/socketMessageContainer';

export class SocketContext {
  public readonly socketClient = new SocketClient(this);

  public readonly socketEventContainer = new SocketEventContainer();

  public readonly socketMessageContainer = new SocketMessageContainer();

  public readonly socketMessageConsumer = new SocketMessageConsumer(this);

  public readonly eventContainer = new SocketEventContainer();
}
