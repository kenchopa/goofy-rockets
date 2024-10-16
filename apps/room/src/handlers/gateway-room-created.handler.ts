import { getContentFromMessage, Message } from '@wgp/amqp';
import logger from '@wgp/logger';

export default async function handleGatewayRoomCreated(
  message: Message,
): Promise<void> {
  logger.info('Gateway room created', getContentFromMessage(message));
}
