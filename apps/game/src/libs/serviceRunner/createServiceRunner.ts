/* eslint-disable import/prefer-default-export */
import { IServiceRunner, ServiceRunner } from './serviceRunner';

export function createServiceRunner(
  fps: number,
  autoStart = false,
): IServiceRunner {
  const runner = new ServiceRunner(fps);
  if (autoStart) {
    runner.start();
  }
  return runner;
}
