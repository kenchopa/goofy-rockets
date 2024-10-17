/* eslint-disable import/prefer-default-export */
export class Player {
  public balance = 50000;

  public cashedOut = false;

  public bet?: { value: number };

  public won?: number;

  constructor(public readonly playerId: number) { }

  public reset(): void {
    this.cashedOut = false;
    this.bet = undefined;
    this.won = undefined;
  }
}
