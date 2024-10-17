/* eslint-disable no-void */
/* eslint-disable import/prefer-default-export */
import { socketEventNames, SocketEventResponse } from '@wgp/domain';
import * as uuid from 'uuid';

import { playerSessionToken } from './constants/playerSessionToken';
import { SocketContext } from './socketContext';

export class SocketService {
  constructor(private readonly context: SocketContext) { }

  public connect(uri: string): Promise<void> {
    this.context.socketClient.init(uri);
    return this.context.socketClient.connect();
  }

  public sendGameInitialize(): Promise<SocketEventResponse[] | undefined> {
    return this.sendEvent({
      eventName: socketEventNames.game.initialised,
      messageData: {},
      requiredResponses: [socketEventNames.rooms.received],
    });
  }

  public sendRoomJoin(
    roomId: string,
  ): Promise<SocketEventResponse[] | undefined> {
    return this.sendEvent({
      eventName: socketEventNames.room.player.join,
      messageData: { roomId },
      requiredResponses: [socketEventNames.room.player.joined],
    });
  }

  private sendEvent(data: {
    eventName: string;
    requiredResponses: string[];
    messageData: unknown;
  }): Promise<SocketEventResponse[] | undefined> {
    return new Promise((res) => {
      const correlationId = uuid.v4();
      const p = new Promise<SocketEventResponse[]>((resP, rej) => {
        this.context.socketMessageContainer.addPendingMessage(
          correlationId,
          data.requiredResponses,
          resP as (msg: SocketEventResponse[]) => void,
          rej,
        );
      });

      void p.then((result) => {
        res(result);
      });
      const messageSend = this.context.socketClient.send(data.eventName, {
        correlationId,
        data: data.messageData,
        event: data.eventName,
        jwt: playerSessionToken,
      });

      if (!messageSend) {
        this.context.socketMessageContainer.removePendingMessage(correlationId);
        res(undefined);
      }
    });
  }
}
