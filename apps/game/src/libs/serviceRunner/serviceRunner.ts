/* eslint-disable class-methods-use-this */
import _ from 'lodash';

import { requestAnimationFrame } from './raf';

export interface IServiceRunner {
  stop(): void;
  start(): void;
  isStopped(): boolean;
  getFps(): number;
  setFps(fps: number): void;
  loopEvent: (dt: number) => void;
  renderEvent: () => void;
}

export type LoopSignature = (deltaT: number) => void;

export class ServiceRunner implements IServiceRunner {
  public loopEvent: LoopSignature;

  public renderEvent: () => void;

  public stepMs = 0;

  public accumulator = 0;

  public lastTime = 0;

  public stopped = true;

  public currentFps = 0;

  public reqAnimFrameHandler = 0;

  constructor(fps: number) {
    this.loopEvent = _.noop.bind(this);
    this.renderEvent = _.noop.bind(this);
    this.setFps(fps);
  }

  public loop(): (newTime: number) => void {
    return (newTime: number): void => {
      if (this.stopped) return;
      const dt = newTime - this.lastTime;
      this.accumulator += dt;
      this.lastTime = newTime;
      this.loopEvent(dt * 0.001);
      if (this.accumulator > this.stepMs) {
        this.accumulator -= this.stepMs;
        this.renderEvent();
      }
      cancelAnimationFrame(this.reqAnimFrameHandler);
      this.reqAnimFrameHandler = requestAnimationFrame()(this.loop());
    };
  }

  public stop(): void {
    this.stopped = true;
  }

  public isStopped(): boolean {
    return this.stopped;
  }

  public start(): void {
    this.stopped = false;
    this.accumulator = 0;
    this.lastTime = this.timestamp();
    this.reqAnimFrameHandler = requestAnimationFrame()(this.loop());
  }

  public getFps(): number {
    return this.currentFps;
  }

  public setFps(fps: number): void {
    this.currentFps = fps;
    this.stepMs = 1000 / this.currentFps;
  }

  public timestamp(): number {
    return window?.performance?.now?.() ?? new Date().getTime();
  }
}
