/* eslint-disable no-plusplus */
import { findIndex } from 'lodash';

export interface ITickEventHandler {
  addEvent(
    id: string,
    event: (deltaT: number) => void,
    active?: boolean,
  ): boolean;
  removeEvent(id: string): boolean;
  setEventActive(id: string, active: boolean): boolean;
  removeAllEvents(): void;
  updateEvents(deltaT: number): void;
  setAllEventsActiveState(active: boolean): void;
  hasEvent(id: string): boolean;
}

interface TickEvent {
  id: string;
  tickEvent: (deltaT: number) => void;
  active: boolean;
}

export class TickEventHandler implements ITickEventHandler {
  private events: TickEvent[] = [];

  public hasEvent(id: string): boolean {
    return findIndex(this.events, (e) => e.id === id) !== -1;
  }

  public addEvent(
    id: string,
    event: (deltaT: number) => void,
    active = true,
  ): boolean {
    if (this.hasEvent(id)) {
      return false;
    }

    this.events.push({
      active,
      id,
      tickEvent: event,
    });
    return true;
  }

  public removeEvent(id: string): boolean {
    const foundIndex = this.getEventIndex(id);
    if (foundIndex === -1) {
      return false;
    }
    this.events = this.events.splice(foundIndex, 1);
    return true;
  }

  public removeAllEvents(): void {
    this.events.length = 0;
  }

  public updateEvents(deltaT: number): void {
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      if (event.active) event.tickEvent(deltaT);
    }
  }

  public setEventActive(id: string, active: boolean): boolean {
    const foundIndex = this.getEventIndex(id);
    if (foundIndex === -1) {
      return false;
    }
    this.events[foundIndex].active = active;
    return true;
  }

  public setAllEventsActiveState(active: boolean): void {
    for (let i = 0; i < this.events.length; i++) {
      this.events[i].active = active;
    }
  }

  private getEventIndex(id: string): number {
    return this.events.findIndex((v) => v.id === id);
  }
}
