import { getContentFromMessage, Message } from '@wgp/amqp';
import logger from '@wgp/logger';

export default async function handleRoundEnded(
  message: Message,
): Promise<void> {
  console.log('message', message);
  
}
