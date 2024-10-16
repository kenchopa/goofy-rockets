/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import { SocketMessageContainer } from './socketMessageContainer';

// consumes socket messages receive from the game logics
export class SocketMessageConsumer {
  constructor(
    private context: { socketMessageContainer: SocketMessageContainer },
  ) {}

  public consumeMessage(msg: unknown): void {
    if (!_.has(msg, 'correlationId') || !_.has(msg, 'data')) {
      console.error(
        `message received without correlationId present, ${JSON.stringify(
          msg,
        )}`,
      );
      return;
    }
    const payloadMessage = msg as { correlationId: string; data: unknown };
    const pendingMessage =
      this.context.socketMessageContainer.findPendingMessage(
        payloadMessage.correlationId,
      );
    pendingMessage.messages.push(payloadMessage.data);
    // TODO check required responses and resolve if all are received
    /*
    pendingMessage.forEach((v) => {
      v.resolver({ ok: true, result: payloadMessage.data });
    });
    */
    this.context.socketMessageContainer.removePendingMessage(
      payloadMessage.correlationId,
    );
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
