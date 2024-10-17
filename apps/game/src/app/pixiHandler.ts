/* eslint-disable import/prefer-default-export */
import * as Pixi from 'pixi.js';

import { DocumentHandler } from './documentHandler';
import { PowerPreferences } from './types/powerPreferences';

export class PixiHandler {
  public application!: Pixi.Application;

  public async init(documentHandler: DocumentHandler): Promise<void> {
    Pixi.Ticker.shared.destroy();

    this.application = new Pixi.Application();

    await this.application.init({
      canvas: documentHandler.canvas,
      clearBeforeRender: false,
      context: documentHandler.canvasContext,
      height: 1080,
      powerPreference: PowerPreferences.HighPerformance,
      preference: 'webgpu',
      webgl: {
        background: 0x00ff00,
      },
      webgpu: {
        background: 0xff0000,
      },
      width: 1920,
    });
    this.application.stage.isRenderGroup = true;
  }
}
