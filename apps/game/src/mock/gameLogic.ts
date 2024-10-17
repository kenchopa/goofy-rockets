/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import { Player } from './player';
import { RoundStep, RoundStepType } from './roundTypes';

export class GameLogic {
  public roundSteps: RoundStep[] = [];

  private createNewRoundData(): void {
    this.roundSteps = _.sample([
      [
        { multiplierValue: 2, type: RoundStepType.Normal },
        { multiplierValue: 3, type: RoundStepType.Normal },
        { multiplierValue: 4, type: RoundStepType.Normal },
        { multiplierValue: 5, type: RoundStepType.Normal },
        { multiplierValue: 6, type: RoundStepType.Normal },
        { multiplierValue: 6, type: RoundStepType.Normal },
      ],
      [
        { multiplierValue: 2, type: RoundStepType.Normal },
        { multiplierValue: 3, type: RoundStepType.Normal },
        { multiplierValue: 4, type: RoundStepType.Normal },
        { multiplierValue: 5, type: RoundStepType.Crash },
      ],
    ]);
  }

  public startRound(players: Player[]): void {
    this.createNewRoundData();
    players.forEach((player) => {
      if (player.bet === undefined) {
        return;
      }
      if (player.balance < player.bet.value) {
        // TODO reset cash mocking
        player.balance = 50000;
      }
      player.balance -= player.bet.value;
    });
  }

  public endStep(players: Player[], roundStepIndex: number): void {
    const roundStep = this.roundSteps[roundStepIndex];

    players.forEach((player) => {
      if (player.won !== undefined || player.bet === undefined) {
        return;
      }
      if (roundStep.type === RoundStepType.Crash) {
        return;
      }
      if (player.cashedOut) {
        player.won = player.bet.value * roundStep.multiplierValue;
        player.balance += player.won;
      }
    });
  }
}
