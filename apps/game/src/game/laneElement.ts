/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import * as Pixi from 'pixi.js';

import { setButtonMode } from '../libs/utilsPixi/setButtonMode';
import {
  getInteractive,
  setInteractive,
} from '../libs/utilsPixi/setInteractive';

export class LaneElement extends Pixi.Container {
  private g = new Pixi.Graphics();

  public onPointerDownHandler: () => void = _.noop.bind(this);

  constructor(private readonly endElement: boolean) {
    super();
    this.addChild(this.g);
    this.setInteractive(false);
  }

  public setInteractive(interactive: boolean): void {
    setInteractive(this, interactive);
    setButtonMode(this, interactive);

    this.draw();
  }

  public draw(): void {
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

    if (getInteractive(this)) {
      this.g.circle(0, 0, 20);
      this.g.fill({ color: 0x0000ff });
    }
  }

  public reset(): void {
    this.visible = true;
    this.setInteractive(false);
  }
}
