/* eslint-disable class-methods-use-this */
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

  private resizeTimeout?: NodeJS.Timeout;

  public async init(): Promise<void> {
    this.serviceRunner.loopEvent = (dt: number): void => {
      this.tickEventHandler.updateEvents(dt);
    };

    this.serviceRunner.renderEvent = (): void => {
      this.pixiHandler.application.renderer.clear();
      this.pixiHandler.application.renderer.render(
        this.pixiHandler.application.stage,
      );
    };

    this.documentHandler.init();
    await this.pixiHandler.init(this.documentHandler);

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resize();
      }, 100);
    });
    this.resize();
  }

  private resize(): void {
    const rect = this.documentHandler.element?.getBoundingClientRect();

    const sx = 1920 / rect!.width;
    const sy = 1080 / rect!.height;

    const scale = sx < sy ? sx : sy;

    this.pixiHandler.application.renderer.resize(rect!.width, rect!.height, 1);

    this.pixiHandler.application.stage.scale.set(scale, scale);
  }
}
