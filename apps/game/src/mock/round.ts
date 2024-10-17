/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/prefer-default-export */

import _ from 'lodash';

import { GameLogic } from './gameLogic';
import { Timer } from './timer';

export class Round {
  public timer = new Timer();

  public betEnableEvent: () => void = _.noop.bind(this);

  public startRoundEvent: () => void = _.noop.bind(this);

  public endRoundEvent: () => void = _.noop.bind(this);

  public startStepEvent: (roundStepIndex: number) => void = _.noop.bind(this);

  public endStepEvent: (roundStepIndex: number) => void = _.noop.bind(this);

  constructor(public readonly gameLogic: GameLogic) { }

  public async start(): Promise<void> {
    this.betEnableEvent();
    await this.timer.start(5000);
    this.startRoundEvent();

    for (let i = 0; i < this.gameLogic.roundSteps.length; i++) {
      this.startStepEvent(i);
      await this.timer.start(10000);
      this.endStepEvent(i);
    }
    this.endRoundEvent();
    await this.timer.start(2000);
    await this.start();
  }

  public update(dtMS: number): void {
    this.timer.update(dtMS);
  }
}
