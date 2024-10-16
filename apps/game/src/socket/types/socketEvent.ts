/* eslint-disable import/no-cycle */
import { SocketContext } from '../socketContext';

export interface SocketEvent {
  context: SocketContext;
  id: string;
  handler: (...args: unknown[]) => void;
}
