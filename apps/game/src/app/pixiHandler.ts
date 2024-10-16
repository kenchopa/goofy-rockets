/* eslint-disable import/prefer-default-export */
import * as Pixi from 'pixi.js';

import { DocumentHandler } from './documentHandler';
import { PowerPreferences } from './types/powerPreferences';

export class PixiHandler {
  public renderer!: Pixi.Renderer;

  public readonly stage = new Pixi.Container();

  public config = {
    antialias: false,
    autoDensity: false,
    backgroundColor: 0x000000,
    height: 1080,
    powerPreference: PowerPreferences.HighPerformance,
    preserveDrawingBuffer: false,
    resolution: 1,
    roundPixels: true,
    transparent: false,
    width: 1920,
  };

  public async init(documentHandler: DocumentHandler): Promise<void> {
    Pixi.Ticker.shared.destroy();

    this.renderer = await Pixi.autoDetectRenderer({
      antialias: this.config.antialias,
      autoDensity: this.config.autoDensity,
      backgroundAlpha: this.config.transparent ? 0 : 1,
      backgroundColor: this.config.backgroundColor,
      clearBeforeRender: false,
      context: documentHandler.canvasContext,
      height: this.config.height,
      powerPreference: this.config.powerPreference!,
      preserveDrawingBuffer: this.config.preserveDrawingBuffer,
      resolution: this.config.resolution,
      view: documentHandler.canvas,
      width: this.config.width,
    });
  }
}
