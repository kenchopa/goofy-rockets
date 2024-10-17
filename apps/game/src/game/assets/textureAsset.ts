/* eslint-disable import/prefer-default-export */
import { AssetType, BaseAsset } from './baseAsset';

export class TextureAsset extends BaseAsset {
  constructor(public readonly url: string, public readonly id: string) {
    super(url, id, AssetType.Texture);
  }
}
