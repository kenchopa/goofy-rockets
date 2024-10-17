/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

import { ResolvablePromise } from '../libs/resolvablePromise';

export class Timer {
  public currentTime = 0;

  public resolvablePromise?: ResolvablePromise;

  public updateEvent: (dtMS: number) => void = _.noop.bind(this);

  public start(time: number): Promise<void> {
    this.resolvablePromise = new ResolvablePromise();
    this.currentTime = time;

    return this.resolvablePromise.promise;
  }

  public update(dtMS: number): void {
    if (!this.resolvablePromise) {
      return;
    }
    this.currentTime -= dtMS;
    this.updateEvent(this.currentTime);
    if (this.currentTime <= 0) {
      this.currentTime = 0;
      this.resolvablePromise.resolve();
      this.resolvablePromise = undefined;
    }
  }
}
