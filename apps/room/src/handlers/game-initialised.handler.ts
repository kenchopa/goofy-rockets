import { getContentFromMessage, Message } from '@wgp/amqp';
import logger from '@wgp/logger';
export default async function handleRoomCreated(
  message: Message,
): Promise<void> {
  logger.info('Room created', getContentFromMessage(message));
}