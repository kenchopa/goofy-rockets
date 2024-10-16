/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { SocketEventResponse } from '@wgp/domain';
import _ from 'lodash';

import { SocketMessageContainer } from './socketMessageContainer';

// consumes socket messages receive from the game logics
export class SocketMessageConsumer {
  constructor(
    private context: { socketMessageContainer: SocketMessageContainer },
  ) { }

  public consumeMessage(msg: SocketEventResponse): void {
    if (!_.has(msg, 'correlationId') || !_.has(msg, 'data')) {
      console.error(
        `message received without correlationId present, ${JSON.stringify(
          msg,
        )}`,
      );
      return;
    }
    const pendingMessage =
      this.context.socketMessageContainer.findPendingMessage(
        msg.correlationId,
      )!;

    pendingMessage.messages.push(msg);

    const allReceivedMessageEvents = _.map(
      pendingMessage.messages,
      (v) => v.event,
    );
    for (let i = 0; i < pendingMessage.requiredResponses.length; i++) {
      const requiredResponse = pendingMessage.requiredResponses[i];
      if (!allReceivedMessageEvents.includes(requiredResponse)) {
        return;
      }
    }
    pendingMessage.resolver(pendingMessage.messages);
    this.context.socketMessageContainer.removePendingMessage(pendingMessage.id);
  }
  /*
  public consumeError(msg: unknown): void {
    if (!_.has(msg, 'correlationId') || !_.has(msg, 'message')) {
      console.error(
        `error received without correlationId present, ${JSON.stringify(msg)}`,
      );

      return;
    }
    const payloadMessage = msg as { correlationId: string; message: string };
    const messageResolvers =
      this.context.socketMessageContainer.findPendingMessage(
        payloadMessage.correlationId,
      );

    this.context.socketMessageContainer.removePendingMessage(
      payloadMessage.correlationId,
    );
  }
  */
}
