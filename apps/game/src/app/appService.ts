/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import * as Pixi from 'pixi.js';

import { ITickEventHandler } from '../libs/eventUpdaterHandler/tickEventHandler';
import { AppContext } from './appContext';

export class AppService {
  constructor(private readonly context: AppContext) { }

  public run(): void {
    this.context.serviceRunner.start();
  }

  public get stage(): Pixi.Container {
    return this.context.pixiHandler.application.stage;
  }

  public get tickEventHandler(): ITickEventHandler {
    return this.context.tickEventHandler;
  }
}
