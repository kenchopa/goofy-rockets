/* eslint-disable @typescript-eslint/naming-convention */
import * as Pixi from 'pixi.js';

import { ChickenDefaultAsset } from './assets/chickenDefaultAsset';
import { ChickenHurtAsset } from './assets/chickenHurtAsset';
import { type Game } from './game';

export enum ChickenState {
  Default = 'default',
  Hurt = 'hurt',
}

export class Chicken extends Pixi.Container {
  private textureDefault!: Pixi.Sprite;

  private textureHurt!: Pixi.Sprite;

  constructor(game: Game) {
    super();
    this.textureDefault = game.loader.sprites[ChickenDefaultAsset.id];
    this.textureHurt = game.loader.sprites[ChickenHurtAsset.id];

    this.textureDefault.anchor.set(0.5, 0.5);
    this.textureDefault.scale.set(0.06, 0.06);

    this.textureHurt.anchor.set(0.5, 0.5);
    this.textureHurt.scale.set(0.08, 0.08);

    this.addChild(this.textureDefault);
    this.addChild(this.textureHurt);

    this.setStateDefault();
  }

  private stateSetter: Record<ChickenState, () => void> = {
    [ChickenState.Default]: this.setStateDefault.bind(this),
    [ChickenState.Hurt]: this.setStateHurt.bind(this),
  };

  private _chickenState: ChickenState = ChickenState.Default;

  public set chickenState(value: ChickenState) {
    if (this._chickenState === value) {
      return;
    }
    this._chickenState = value;
    this.stateSetter[this._chickenState]();
  }

  private setStateDefault(): void {
    this.textureDefault.visible = true;
    this.textureHurt.visible = false;
  }

  private setStateHurt(): void {
    this.textureDefault.visible = false;
    this.textureHurt.visible = true;
  }
}
