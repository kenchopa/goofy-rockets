/* eslint-disable import/prefer-default-export */
import { AppService } from '../app/appService';
import { GameLoader } from './gameLoader';
import { LaneChickenMediator } from './laneChickenMediator';

export class Game {
  public readonly loader = new GameLoader();

  public async init(app: AppService): Promise<void> {
    await this.loader.load();

    const laneMediator = new LaneChickenMediator(this, 0);

    laneMediator.reset();

    app.stage.addChild(laneMediator.view);
  }
}
