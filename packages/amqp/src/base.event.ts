import { v4 as uuidV4 } from 'uuid';

import { MessageHeaders, MessagePayload, publishMessage } from './amqp.handler';

const convertDateToUnixTimestamp = (date: Date) =>
  Math.floor(date.getTime() / 1000);

export default abstract class BaseEvent<T> {
  abstract eventName: string;

  abstract routingKey: string;

  payload: T;

  occurredOn: Date;

  headers?: MessageHeaders;

  constructor(
    source: string,
    payload: T,
    occurredOn?: Date,
    headers?: MessageHeaders,
  ) {
    this.payload = payload;
    this.occurredOn = occurredOn || new Date();
    this.headers = {
      ...headers,
      contentType: 'application/json',
      messageId: uuidV4(),
      source,
      timestamp: convertDateToUnixTimestamp(this.occurredOn),
      version: '1',
    };
  }

  // This method creates the event structure to be published
  createMessage(): {
    payload: MessagePayload;
    headers: MessageHeaders;
    routingKey: string;
  } {
    return {
      headers: this.headers!,
      payload: this.payload as unknown as MessagePayload,
      routingKey: this.routingKey,
    };
  }

  // Publish the event using RabbitMQ
  async publish(exchange: string): Promise<void> {
    await publishMessage(
      exchange,
      this.routingKey,
      this.payload as unknown as MessagePayload,
      this.headers,
    );
  }

  getEventName(): string {
    return this.eventName;
  }

  getRoutingKey(): string {
    return this.routingKey;
  }
}
