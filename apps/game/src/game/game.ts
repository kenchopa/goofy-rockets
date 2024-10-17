/* eslint-disable import/prefer-default-export */
import { AppService } from '../app/appService';
import { GameLoader } from './gameLoader';
import { LaneChickenMediator } from './laneChickenMediator';

export class Game {
  public readonly loader = new GameLoader();

  private lanes: LaneChickenMediator[] = [];

  constructor(public readonly app: AppService) { }

  public async init(): Promise<void> {
    await this.loader.load();
  }

  public addLane(): LaneChickenMediator {
    const lane = new LaneChickenMediator(this, this.lanes.length);
    this.lanes.push(lane);
    this.app.stage.addChild(lane.view);
    return lane;
  }

  public resetGame(): void {
    this.lanes.forEach((lane) => {
      lane.reset();
    });
  }
}
