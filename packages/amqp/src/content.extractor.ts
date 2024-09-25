import { ServiceError } from '@wgp/errors';
import { Message } from 'amqplib';

export default function getContentFromMessage<T>(message: Message): T {
  try {
    if (!message.content) {
      throw new Error('Message content is empty');
    }

    return JSON.parse(message.content.toString('utf8'));
  } catch (error) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      `Error while parsing message body: ${(error as Error).message}`,
      error as Error,
    );
  }
}
