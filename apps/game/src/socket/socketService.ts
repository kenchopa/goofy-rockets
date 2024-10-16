/* eslint-disable no-void */
/* eslint-disable import/prefer-default-export */
import { socketEventNames } from '@wgp/domain';
import * as uuid from 'uuid';

import { playerSessionToken } from './constants/playerSessionToken';
import { SocketContext } from './socketContext';

export class SocketService {
  constructor(private readonly context: SocketContext) { }

  public connect(uri: string): Promise<void> {
    console.log('connecting to socket', uri);
    this.context.socketClient.init(uri);
    return this.context.socketClient.connect();
  }

  public sendGameInitialize(): Promise<unknown | undefined> {
    return new Promise((res) => {
      const correlationId = uuid.v4();
      const p = new Promise<unknown>((resP, rej) => {
        this.context.socketMessageContainer.addPendingMessage(
          correlationId,
          [],
          resP as (msg: unknown) => void,
          rej,
        );
      });

      void p.then((result) => {
        res(result);
      });
      const messageSend = this.context.socketClient.send(
        socketEventNames.game.initialize,
        {
          correlationId,
          data: {},
          event: socketEventNames.game.initialized,
          jwt: playerSessionToken,
        },
      );

      if (!messageSend) {
        this.context.socketMessageContainer.removePendingMessage(correlationId);
        res(undefined);
      }
    });
  }
}
