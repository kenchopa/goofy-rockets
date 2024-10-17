/* eslint-disable import/prefer-default-export */
import * as Pixi from 'pixi.js';

export class BackgroundLane extends Pixi.Container {
  private g = new Pixi.Graphics();

  public readonly laneWidth = 150;

  public readonly lanes = 5;

  public readonly startSize = 200;

  public readonly endSize = 200;

  public readonly laneHeight = 120;

  constructor() {
    super();

    this.g.rect(
      0,
      0,
      this.startSize + this.endSize + this.lanes * this.laneWidth,
      this.laneHeight,
    );
    this.g.fill({ alpha: 1, color: 0x0000ff });
    this.g.rect(0, 0, this.startSize, this.laneHeight);
    this.g.fill({ alpha: 1, color: 0x00aa00 });

    for (let i = 0; i < this.lanes + 1; i++) {
      this.g.rect(
        this.startSize + i * this.laneWidth - 5,
        0,
        10,
        this.laneHeight,
      );
      this.g.fill({ alpha: 0.3, color: 0xffffff });
    }

    this.g.rect(
      this.startSize + this.lanes * this.laneWidth,
      0,
      this.endSize,
      this.laneHeight,
    );
    this.g.fill({ alpha: 1, color: 0x00aa00 });

    this.addChild(this.g);
  }
}
