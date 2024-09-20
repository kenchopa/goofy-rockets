import { setRequestContext } from '@wgp/context';
import { BadRequestError } from '@wgp/errors';
import { Context, Next } from 'koa';

export default function makeRequestContextMiddleware() {
  return async (ctx: Context, next: Next) => {
    const { token, correlationId } = ctx.state;
    setRequestContext({
      correlationId,
    });

    if (!correlationId) {
      throw BadRequestError.forHeader('x-correlation-id');
    }
    ctx.state.correlationId = correlationId;

    return next();
  };
}
