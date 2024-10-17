/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import * as Pixi from 'pixi.js';

export class LaneElement extends Pixi.Container {
  private g = new Pixi.Graphics();

  public onPointerDownHandler: () => void = _.noop.bind(this);

  constructor(private readonly endElement: boolean) {
    super();
    this.addChild(this.g);
    this.draw();
  }

  private draw(): void {
    if (this.endElement) {
      this.g.circle(0, 0, 40);
      this.g.fill({ color: 0x00aa00 });
      this.g.circle(0, 0, 30);
      this.g.fill({ color: 0x009900 });
    } else {
      this.g.circle(0, 0, 40);
      this.g.fill({ color: 0x00aa00 });
      this.g.circle(0, 0, 30);
      this.g.fill({ color: 0x009900 });
    }
  }

  public reset(): void {
    this.visible = true;
  }
}
