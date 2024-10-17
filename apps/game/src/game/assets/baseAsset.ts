/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/prefer-default-export */

export enum AssetType {
  Texture = 'texture',
}

export class BaseAsset {
  constructor(
    public readonly url: string,
    public readonly id: string,
    public readonly assetType: AssetType,
  ) { }
}
