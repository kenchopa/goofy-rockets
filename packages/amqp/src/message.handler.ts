import { setRequestContext } from '@wgp/context';
import { AmqpError, BaseError, isAmqpError } from '@wgp/errors';
import logger from '@wgp/logger';
import { Channel, ConsumeMessage } from 'amqplib';

import { getEnvVar, ROUTING_KEY_RETRY_SUFFIX } from './amqp.handler';
import Consumer from './consumer.type';
import { type QueueOptions } from './queue.router';

export default function createMessageHandler(
  consumer: Consumer,
  channel: Channel,
  queueOptions: QueueOptions,
) {
  return async (message: ConsumeMessage) => {
    try {
      // Set request context for message consuming
      setRequestContext({
        correlationId: message.properties?.headers?.correlationId,
      });

      // handle the consumer for the message
      await consumer(message);

      // Acknowledge the message
      return channel.ack(message);
    } catch (error) {
      let baseError: BaseError = error as BaseError;
      // If the error is not an instance of BaseError, wrap it in an AmqpError
      if (!(error instanceof BaseError)) {
        baseError = new AmqpError(
          'DEAD_LETTER',
          (error as Error).message,
          error as Error,
        );
      }

      const { routingKey } = message.fields;
      const { messageId } = message.properties;
      logger.error(
        `Failed to process incoming message. RoutingKey: ${routingKey} messageId: ${messageId}.`,
        { error, message },
      );

      // If the error is not an instance of AmqpError, throw as is
      if (!isAmqpError(baseError)) {
        throw error;
      }

      // Handle the error as an acknowledged message
      if (baseError.code === 'ACKNOWLEDGE') {
        return channel.ack(message);
      }

      // Handle the error as a dead letter message
      if (baseError.code === 'DEAD_LETTER') {
        return channel.nack(message, false, false);
      }

      // TODO CHECK RETRYABLE FLOW

      // Handle the error as a retryable message
      /* const isRetryMessage = queueOptions.retry && routingKey.endsWith(ROUTING_KEY_RETRY_SUFFIX);
      if (!isRetryMessage) {
        logger.warning(
          `Caught retryable error but routing key "${routingKey}" does not exist for queue "${queueOptions.name}" on exchange "${queueOptions.exchange}", defaulting to amqp requeue`,
        );
        channel.nack(message, false, true);
        return;
      } */

      let maxRetries = 3;
      try {
        maxRetries = Number(getEnvVar('RABBITMQ_MAX_RETRIES'));
      } catch (e) {
        logger.warning(
          'RABBITMQ_MAX_RETRIES is not defined. Defaulting to 3 retries.',
        );
      }

      const nrOfRetries = message.properties?.headers?.['x-retry'] ?? 0;
      if (nrOfRetries >= maxRetries) {
        return channel.nack(message, false, false);
      }

      // re-publish the same message instead of using requeue
      // this otherwise spams the rabbitmq
      channel.ack(message);

      channel.publish(
        queueOptions.exchange,
        `${routingKey}${ROUTING_KEY_RETRY_SUFFIX}`,
        message.content,
        {
          ...message.properties,
          headers: {
            ...message.properties.headers,
            'x-retry': nrOfRetries + 1,
          },
        },
      );
    }

    return channel.nack(message, false, false);
  };
}
