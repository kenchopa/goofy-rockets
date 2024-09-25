import logger from '@wgp/logger';
import type { Channel } from 'amqplib';

import { DEAD_LETTER_EXCHANGE, ROUTING_KEY_RETRY_SUFFIX } from './amqp.handler';
import type Consumer from './consumer.type';
import createMessageHandler from './message.handler';

export type QueueName = string;
export type RoutingKey = string;
export type QueueOptions = {
  name: QueueName;
  exchange: string;
  dlq?: string;
  autoDlq?: boolean;
  retry?: boolean;
};

/**
 * An API installing a router on a specific queue.
 *
 * @param channel The channel for which an amqp connection was established
 * @param queue A reference to the queue that needs to be bound to the channel.
 * If not a reference it can be an object containing queue options for creating
 * dead-letter queue(s)
 * @param routes A key-value object representation of the routes available on the
 * queue. Where the key represents the routing key and it's value the consumer
 */
export default async function installQueueRouter(
  channel: Channel,
  queueOptions: QueueOptions,
  routes: Partial<Record<RoutingKey, Consumer>>,
) {
  const { name: queueName, exchange, dlq, autoDlq, retry } = queueOptions;

  // Create new versions of routes and queueRoutingKeys to avoid modifying the parameters
  const updatedRoutes = { ...routes };
  let updatedQueueRoutingKeys = Object.keys(routes); // Copy of original routing keys

  // for each routing key with need to append a retry suffix and add them to the routes when retry is enabled
  if (retry) {
    updatedQueueRoutingKeys = [
      ...updatedQueueRoutingKeys,
      ...updatedQueueRoutingKeys.map(
        (routingKey) => `${routingKey}${ROUTING_KEY_RETRY_SUFFIX}`,
      ),
    ];

    updatedQueueRoutingKeys.forEach((routingKey) => {
      updatedRoutes[`${routingKey}${ROUTING_KEY_RETRY_SUFFIX}`] =
        routes[routingKey];
    });
  }

  try {
    await channel.assertQueue(queueName, {
      arguments: {
        'x-dead-letter-exchange': DEAD_LETTER_EXCHANGE,
      },
    });

    // Bind the queue to the exchange with the given routing keys
    await Promise.all(
      updatedQueueRoutingKeys.map(async (routingKey) => {
        await channel.bindQueue(queueName, exchange, routingKey);

        // Don't automatically make a dead-letter queue
        if (!queueName && !(autoDlq ?? true)) {
          return;
        }

        // Make a separate dead-letter queue for each topic or
        // a specific one for the queue coming from `queue.dlq`
        const response = await channel.assertQueue(
          !queueName && dlq != null ? dlq : `dead-letter.${routingKey}`,
        );
        await channel.bindQueue(
          response.queue,
          DEAD_LETTER_EXCHANGE,
          routingKey,
        );
      }),
    );

    await channel.consume(queueName, async (msg) => {
      if (msg == null) {
        return;
      }

      const { routingKey } = msg.fields;

      if (!updatedQueueRoutingKeys.includes(routingKey)) {
        throw new Error(
          `Routing key "${routingKey}" not found for queue router.`,
        );
      }

      // Non-null assert the consumer lookup from the routes map
      const consumer = updatedRoutes[routingKey as RoutingKey] as Consumer;
      if (!consumer) {
        throw new Error(
          `Consumer not found for routing key "${routingKey}" in routes.`,
        );
      }

      const routeHandler = createMessageHandler(
        consumer,
        channel,
        queueOptions,
      );

      await routeHandler(msg);
    });
  } catch (error) {
    logger.error(
      `Failed to create queue "${queueName}" for routing keys "${updatedQueueRoutingKeys.join(
        '", "',
      )}"`,
    );
    throw error;
  }
}
