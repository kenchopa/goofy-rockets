/* eslint-disable import/prefer-default-export */
import * as Pixi from 'pixi.js';

import { AppContext } from './appContext';

/* eslint-disable class-methods-use-this */
export class AppService {
  constructor(private readonly context: AppContext) {}

  public run(): void {
    this.context.serviceRunner.start();
  }

  public get stage(): Pixi.Container {
    return this.context.pixiHandler.stage;
  }
}
