import {
  makeBodyParserMiddleware,
  makeCorrelationMiddleware,
  makeCorsMiddleware,
  makeErrorResponderMiddleware,
  makeHealthMiddleware,
  makeQueryStringMiddleware,
  makeRequestLoggerMiddleware,
  makeRouter,
  makeSecurityHeadersMiddleware,
  makeValidateMiddleware,
} from '@wgp/koa';
import logger from '@wgp/logger';
import Koa from 'koa';

import routes from '../routes';

export default function initializeMiddleware(app: Koa) {
  const router = makeRouter(routes);

  makeQueryStringMiddleware(app);

  app.use(makeCorsMiddleware());
  app.use(makeRequestLoggerMiddleware());
  app.use(makeErrorResponderMiddleware());
  app.use(makeBodyParserMiddleware());
  app.use(makeSecurityHeadersMiddleware());
  app.use(makeValidateMiddleware());
  app.use(makeHealthMiddleware({ }));
  app.use(makeCorrelationMiddleware());
  app.use(router.routes());
  app.use(router.allowedMethods());

  logger.info('Middleware initialized.');
}
