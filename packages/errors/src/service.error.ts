import BaseError from './base.error';

export type ServiceErrorCode =
  | 'UNKNOWN_ERROR'
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR';

export function isServiceError(error: unknown): error is ServiceError {
  return (error as ServiceError).name === 'ServiceError';
}

export default class ServiceError extends BaseError {
  readonly name = 'ServiceError';

  constructor(
    code: ServiceErrorCode | string,
    message: string,
    previous?: Error,
  ) {
    super(message, code, previous);
  }
}
