/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { io, Socket } from 'socket.io-client';

import { SocketEvent } from './types/socketEvent';
import { SocketEventContainer } from './utils/socketEventContainer';

export class SocketClient {
  private socket?: Socket;

  constructor(
    private readonly context: { eventContainer: SocketEventContainer },
  ) { }

  public init(uri: string): void {
    this.socket = io(uri, {
      autoConnect: false,
      reconnection: false,
      reconnectionAttempts: 9,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      timeout: 4000,
      transports: ['websocket'],
    });
  }

  public addSocketEvent(event: SocketEvent): void {
    if (!this.socket) {
      return;
    }
    console.log('adding socket event', event.eventName);
    this.socket.on(event.eventName, event.handler.bind(event));
  }

  public removeSocketEvent(event: SocketEvent): void {
    if (!this.socket) {
      return;
    }
    this.socket.off(event.eventName, event.handler);
  }

  public onConnect(): void {
    this.context.eventContainer.socketEvents.forEach((v) => {
      this.socket!.on(v.eventName, v.handler);
    });
  }

  public connect(): Promise<void> {
    return new Promise<void>((res): void => {
      if (!this.socket) {
        console.warn(
          'unable to establish socket connection without initializing',
        );
        res();
        return;
      }
      if (this.socket.connected) {
        console.warn(
          'unable to establish socket connection, socket already connected',
        );
        res();
        return;
      }
      this.socket.removeAllListeners();
      this.socket.on('connect', () => {
        this.onConnect();
        res();
      });
      this.socket.connect();
    });
  }

  public disconnect(): void {
    if (!this.socket) {
      return;
    }
    if (this.socket.connected) {
      this.socket.disconnect();
    }
    this.socket = undefined;
  }

  public send(event: string, msg: unknown): boolean {
    if (!this.socket) {
      console.warn('unable to send socket data without initializing');
      return false;
    }
    if (!this.socket.connected) {
      console.warn('unable to send socket data, socket not connected');
      return false;
    }
    console.log('sending socket message', event, msg);
    this.socket.emit(event, msg);
    return true;
  }
}
