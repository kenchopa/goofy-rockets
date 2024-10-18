import { v4 as uuidV4 } from 'uuid';

import {
  MessageHeaders,
  MessagePayload,
  MessageProperties,
  publishMessage,
} from './amqp.handler';

const convertDateToUnixTimestamp = (date: Date) =>
  Math.floor(date.getTime() / 1000);

export default abstract class BaseEvent<T> {
  abstract eventName: string;

  abstract routingKey: string;

  payload: T;

  occurredOn: Date;

  headers?: MessageHeaders;

  private properties?: MessageProperties;

  constructor(
    source: string,
    payload: T,
    occurredOn?: Date,
    headers?: MessageHeaders,
  ) {
    this.payload = payload;
    this.occurredOn = occurredOn || new Date();

    const extendedHeaders = {
      ...headers,
      source,
      version: '1',
    };

    this.headers = extendedHeaders;
    this.properties = {
      contentType: 'application/json',
      headers: extendedHeaders,
      messageId: uuidV4(),
      timestamp: convertDateToUnixTimestamp(this.occurredOn),
    };
  }

  // Publish the event using RabbitMQ
  async publish(exchange: string): Promise<void> {
    await publishMessage(
      exchange,
      this.routingKey,
      this.payload as unknown as MessagePayload,
      this.properties,
    );
  }

  getEventName(): string {
    return this.eventName;
  }

  getRoutingKey(): string {
    return this.routingKey;
  }
}
