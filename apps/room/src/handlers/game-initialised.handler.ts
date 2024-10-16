import { getContentFromMessage, Message } from '@wgp/amqp';
import logger from '@wgp/logger';
export default async function handleGameInitialised(
  message: Message,
): Promise<void> {
  logger.info('Game initialised', getContentFromMessage(message));
}