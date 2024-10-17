/* eslint-disable import/prefer-default-export */

import { TextureAsset } from './textureAsset';

export class EndChickenAsset extends TextureAsset {
  constructor() {
    super('endChicken.jpg', EndChickenAsset.id);
  }

  static get id(): string {
    return 'endChicken';
  }
}
