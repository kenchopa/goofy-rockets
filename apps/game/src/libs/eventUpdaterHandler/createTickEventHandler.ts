/* eslint-disable import/prefer-default-export */
import { ITickEventHandler, TickEventHandler } from './tickEventHandler';

export function createTickEventHandler(): ITickEventHandler {
  return new TickEventHandler();
}
