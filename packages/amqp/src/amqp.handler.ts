import sleep from '@wgp/delayer';
import logger from '@wgp/logger';
import { Channel, connect, Connection } from 'amqplib';

import type { QueueName } from './queue.router';

export const ROUTING_KEY_RETRY_SUFFIX = '.retry';
export const DEAD_LETTER_EXCHANGE = 'dead-letter';
const TIMEOUT_INTERVAL_MS = 1000;

let channel: Channel;
let connection: Connection;
let connectionRetries = 1;

export type HealthResponse = {
  message: string;
  success: boolean;
};

export const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
};

const initialize = async () => {
  try {
    connection = await connect({
      heartbeat: Number(getEnvVar('RABBITMQ_HEARTBEAT')),
      hostname: getEnvVar('RABBITMQ_HOST'),
      password: getEnvVar('RABBITMQ_PASSWORD'),
      port: Number(getEnvVar('RABBITMQ_PORT')), // Assuming port is a number
      username: getEnvVar('RABBITMQ_USER'),
      vhost: getEnvVar('RABBITMQ_VHOST'),
    });

    channel = await connection.createChannel();

    // The maximum number of messages sent over the channel that can be awaiting acknowledgement
    let prefetchCount = 1;
    try {
      prefetchCount = Number(getEnvVar('RABBITMQ_PREFETCH_COUNT'));
    } catch (error) {
      logger.warning(
        'RABBITMQ_PREFETCH_COUNT is not defined. Defaulting to 1 message.',
      );
    }
    await channel.prefetch(prefetchCount);

    // Make an exchange for dead letter traffic of messages on the service
    await channel.assertExchange(DEAD_LETTER_EXCHANGE, 'direct');
  } catch (error) {
    logger.error(
      `Failed to set up RabbitMQ. Re-trying in ${connectionRetries} seconds...`,
      {
        errorMessage: (error as Error).message,
      },
    );

    await sleep(connectionRetries * TIMEOUT_INTERVAL_MS);
    connectionRetries += 1;
    await initialize();

    return channel;
  }

  return channel;
};

export const getChannel = () => channel;

export const checkHealth = async (
  exchange: string,
): Promise<HealthResponse> => {
  try {
    if (channel == null) {
      throw new Error('AMQP server is disconnected.');
    }

    await channel.checkExchange(exchange);

    return {
      message: 'OK',
      success: true,
    };
  } catch (error) {
    return {
      message:
        (error as Error).message ??
        `Unknown error in RabbitMQ health check for exchange ${exchange}`,
      success: false,
    };
  }
};

/**
 * @param installRouterStack A callback installing all Queue routers for the
 * initialized channel
 */
export default async function setupRabbitMQ(
  installRouterStack: (channel: Channel) => Promise<unknown>,
) {
  logger.info('Setting up RabbitMQ...');

  await initialize();

  connection.on('close', async () => {
    logger.error(
      `RabbitMQ connection closed. Re-trying in ${connectionRetries} seconds...`,
    );

    await sleep(connectionRetries * TIMEOUT_INTERVAL_MS);
    connectionRetries += 1;
    await setupRabbitMQ(installRouterStack);
  });

  await installRouterStack(channel);

  connectionRetries = 1;
  logger.info('RabbitMQ setup completed!');
}

export async function checkQueue(queue: QueueName) {
  if (!channel) {
    throw new Error('No channel found.');
  }

  return channel.checkQueue(queue);
}

// Define the type for headers
export type MessageHeaders = {
  correlationId?: string; // A unique ID to track the message
  contentType?: string; // e.g., 'application/json'
  appId?: string; // The ID of the application publishing the message
  messageId?: string; // Unique ID for the message itself
  timestamp?: number; // Timestamp of when the message was created
  [key: string]: string | number | undefined; // Allows for additional headers
};

export interface JSONObject {
  [key: string]: string | number | boolean | null | JSONObject | JSONArray;
}

export interface JSONArray
  // eslint-disable-next-line prettier/prettier
  extends Array<string | number | boolean | null | JSONObject | JSONArray> { }

// Define the type for the message payload which must always be an object (key-value)
export type MessagePayload = JSONObject;

export type MessageProperties = {
  headers?: MessageHeaders;
  persistent?: boolean;
  contentType?: string;
  contentEncoding?: string;
  messageId?: string;
  timestamp?: number;
  appId?: string;
};

export const publishMessage = async (
  exchange: string,
  routingKey: string,
  message: MessagePayload,
  properties: MessageProperties = {},
): Promise<void> => {
  if (!channel) {
    throw new Error('No channel available for publishing messages.');
  }

  return new Promise((resolve, reject) => {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const options = {
        appId: properties.appId,
        contentEncoding: properties.contentEncoding ?? 'utf-8',
        contentType: properties.contentType ?? 'application/json',
        headers: properties.headers,
        messageId: properties.messageId,
        persistent: properties.persistent ?? true,
        timestamp: properties.timestamp,
      };
      const success = channel.publish(
        exchange,
        routingKey,
        messageBuffer,
        options,
      );

      if (!success) {
        // When publish returns false, we can handle backpressure
        channel.once('drain', resolve);
      } else {
        resolve();
      }

      logger.info(
        `Message published to exchange '${exchange}' with routing key '${routingKey}'`,
      );
    } catch (error) {
      logger.error(`Failed to publish message to exchange '${exchange}'`, {
        errorMessage: (error as Error).message,
      });
      reject(error);
    }
  });
};
