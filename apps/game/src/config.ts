import 'dotenv/config';

import logger from '@wgp/logger';
import Joi from 'joi';

type App = {
  DOCS_URI: string;
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  SERVICE_NAME: string;
  LOG_LEVEL:
    | 'emerg'
    | 'alert'
    | 'crit'
    | 'error'
    | 'warning'
    | 'notice'
    | 'info'
    | 'debug';
};

type Config = {
  APP: App;
};

const configSchema = Joi.object({
  DOCS_URI: Joi.string().required(),
  LOG_LEVEL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(3000),
});

const {
  error,
  value: { DOCS_URI, LOG_LEVEL, NODE_ENV, PORT, SERVICE_NAME },
} = configSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  logger.error('Something went wrong with the provided environment variables.');
  logger.error(error.message);
  process.exit(1);
}

const config: Config = {
  APP: {
    DOCS_URI,
    LOG_LEVEL,
    NODE_ENV,
    PORT,
    SERVICE_NAME,
  },
};

export default config;
