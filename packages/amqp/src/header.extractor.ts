import { ServiceError } from '@wgp/errors';
import { Message } from 'amqplib';

export default function getHeadersFromMessage(
  message: Message,
): Record<string, any> {
  try {
    if (!message.properties || !message.properties.headers) {
      throw new Error('Message headers are missing');
    }

    return message.properties.headers;
  } catch (error) {
    throw new ServiceError(
      'HEADER_EXTRACTION_ERROR',
      `Error while extracting message headers: ${(error as Error).message}`,
      error as Error,
    );
  }
}
