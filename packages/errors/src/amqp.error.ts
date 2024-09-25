import BaseError from './base.error';

export type AmqpErrorCode = 'DEAD_LETTER' | 'RETRYABLE' | 'ACKNOWLEDGE';

export function isAmqpError(error: unknown): error is AmqpError {
  return (error as Error).name === 'AmqpError';
}

export default class AmqpError extends BaseError {
  readonly name = 'AmqpError';

  constructor(readonly code: AmqpErrorCode, message: string, previous?: Error) {
    super(message, code, previous);
  }
}
