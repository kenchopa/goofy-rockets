/* eslint-disable import/prefer-default-export */
import * as Pixi from 'pixi.js';

import { AssetType, BaseAsset } from './assets/baseAsset';
import { ChickenDefaultAsset } from './assets/chickenDefaultAsset';
import { ChickenHurtAsset } from './assets/chickenHurtAsset';
import { EndChickenAsset } from './assets/endChickenAsset';

export class GameLoader {
  public sprites: Record<string, Pixi.Sprite> = {};

  private readonly loader = Pixi.Assets;

  public assets: BaseAsset[] = [
    new ChickenDefaultAsset(),
    new ChickenHurtAsset(),
    new EndChickenAsset(),
  ];

  public async load(): Promise<void> {
    await Promise.all(
      this.assets.map(async (asset) => {
        if (asset.assetType === AssetType.Texture) {
          await this.loader.load({
            loadParser: 'loadTextures',
            src: asset.url,
          });
          this.sprites[asset.id] = Pixi.Sprite.from(asset.url);
        }
      }),
    );
  }
}
