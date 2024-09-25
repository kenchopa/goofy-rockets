export { checkHealth, default as setupRabbitMQ } from './amqp.handler';
export type { default as Consumer } from './consumer.type';
export { default as getContentFromMessage } from './content.extractor';
export {
  type QueueOptions,
  default as installQueueRouter,
} from './queue.router';
