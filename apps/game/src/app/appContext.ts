/* eslint-disable import/prefer-default-export */
import { createTickEventHandler } from '../libs/eventUpdaterHandler/createTickEventHandler';
import { createServiceRunner } from '../libs/serviceRunner/createServiceRunner';
import { DocumentHandler } from './documentHandler';
import { PixiHandler } from './pixiHandler';

export class AppContext {
  public serviceRunner = createServiceRunner(60, false);

  public tickEventHandler = createTickEventHandler();

  public documentHandler = new DocumentHandler();

  public pixiHandler = new PixiHandler();

  public async init(): Promise<void> {
    this.serviceRunner.loopEvent = (dt: number): void => {
      this.tickEventHandler.updateEvents(dt);
    };

    this.serviceRunner.renderEvent = (): void => {
      this.pixiHandler.renderer.clear();
      this.pixiHandler.renderer.render(this.pixiHandler.stage);
    };

    this.documentHandler.init();
    await this.pixiHandler.init(this.documentHandler);
  }
}
