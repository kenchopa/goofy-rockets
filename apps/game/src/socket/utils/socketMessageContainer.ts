/* eslint-disable import/prefer-default-export */
import { SocketEventResponse } from '@wgp/domain';
import _ from 'lodash';

export interface PendingMessage {
  id: string;
  requiredResponses: string[];
  messages: SocketEventResponse[];
  resolver: (msg: SocketEventResponse[]) => void;
  rejecter: (msg: unknown) => void;
}

export class SocketMessageContainer {
  private pendingResults: PendingMessage[] = [];

  public addPendingMessage(
    id: string,
    requiredResponses: string[],
    resolver: (msgs: SocketEventResponse[]) => void,
    rejecter: (msg: unknown) => void,
  ): void {
    this.pendingResults.push({
      id,
      messages: [],
      rejecter,
      requiredResponses,
      resolver,
    });
  }

  public removePendingMessage(id: string): void {
    _.remove(this.pendingResults, (v) => v.id === id);
  }

  public findPendingMessage(id: string): PendingMessage | undefined {
    return _.find(this.pendingResults, (v) => v.id === id);
  }
}
