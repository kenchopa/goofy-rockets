export default abstract class BaseEvent<T> {
  abstract eventName: string;

  abstract routingKey: string;

  // eslint-disable-next-line prettier/prettier
  constructor(protected readonly payload: T) { }

  getPayload(): T {
    return this.payload;
  }

  getEventName(): string {
    return this.eventName;
  }

  getRoutingKey(): string {
    return this.routingKey;
  }
}
