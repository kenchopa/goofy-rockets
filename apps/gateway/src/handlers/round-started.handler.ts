import { getContentFromMessage, Message } from '@wgp/amqp';
import logger from '@wgp/logger';

export default async function handleRoundStarted(
  message: Message,
): Promise<void> {
  logger.info('message', message);
  
}
