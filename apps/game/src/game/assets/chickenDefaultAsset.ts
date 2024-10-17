/* eslint-disable import/prefer-default-export */

import { TextureAsset } from './textureAsset';

export class ChickenDefaultAsset extends TextureAsset {
  constructor() {
    super('chickenNormal.png', ChickenDefaultAsset.id);
  }

  static get id(): string {
    return 'chickenDefault';
  }
}
