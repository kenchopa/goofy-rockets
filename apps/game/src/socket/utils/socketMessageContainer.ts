/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export class SocketMessageContainer {
  private pendingResults: {
    id: string;
    requiredResponses: string[];
    messages: unknown[];
    resolver: (msg: unknown) => void;
    rejecter: (msg: unknown) => void;
  }[] = [];

  public addPendingMessage(
    id: string,
    requiredResponses: string[],
    resolver: (msg: unknown) => void,
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

  public findPendingMessage(id: string): {
    id: string;
    resolver: (msg: unknown) => void;
    requiredResponses: string[];
    messages: unknown[];
  } {
    return _.find(this.pendingResults, (v) => v.id === id)!;
  }
}
