/* eslint-disable import/prefer-default-export */

import { TextureAsset } from './textureAsset';

export class ChickenHurtAsset extends TextureAsset {
  constructor() {
    super('chickenHurt.jpg', ChickenHurtAsset.id);
  }

  static get id(): string {
    return 'chickenHurt';
  }
}
