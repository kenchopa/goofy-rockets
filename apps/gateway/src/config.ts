import 'dotenv/config';

import logger from '@wgp/logger';
import Joi from 'joi';

type LogLevel =
  | 'emerg'
  | 'alert'
  | 'crit'
  | 'error'
  | 'warning'
  | 'notice'
  | 'info'
  | 'debug';

type App = {
  DOCS_URI: string;
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  SERVICE_NAME: string;
  LOG_LEVEL: LogLevel;
};

type RabbitMQ = {
  HOST: string;
  PORT: number;
  USER: string;
  PASSWORD: string;
  VHOST: string;
  EXCHANGE: string;
  HEARTBEAT: number;
  EXCHANGE_WO_IN: 'wo_in';
  EXCHANGE_WO_OUT: 'wo_out';
};

type Redis = {
  HOST: string;
  PASSWORD: string;
  DB: number;
  PORT: number;
};

type Config = {
  APP: App;
  RABBITMQ: RabbitMQ;
  REDIS: Redis;
};

const configSchema = Joi.object({
  DOCS_URI: Joi.string().required(),
  LOG_LEVEL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(3000),
  RABBITMQ_EXCHANGE: Joi.string().required(),
  RABBITMQ_HEARTBEAT: Joi.number().required(),
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_USER: Joi.string().required(),
  RABBITMQ_VHOST: Joi.string().required(),
  REDIS_DB: Joi.number().default(0),
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  SERVICE_NAME: Joi.string().required(),
});

const {
  error,
  value: {
    DOCS_URI,
    LOG_LEVEL,
    NODE_ENV,
    PORT,
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_PASSWORD,
    RABBITMQ_USER,
    RABBITMQ_VHOST,
    RABBITMQ_EXCHANGE,
    RABBITMQ_HEARTBEAT,
    SERVICE_NAME,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_DB,
  },
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
  RABBITMQ: {
    EXCHANGE: RABBITMQ_EXCHANGE,
    EXCHANGE_WO_IN: 'wo_in',
    EXCHANGE_WO_OUT: 'wo_out',
    HEARTBEAT: RABBITMQ_HEARTBEAT,
    HOST: RABBITMQ_HOST,
    PASSWORD: RABBITMQ_PASSWORD,
    PORT: RABBITMQ_PORT,
    USER: RABBITMQ_USER,
    VHOST: RABBITMQ_VHOST,
  },
  REDIS: {
    DB: REDIS_DB,
    HOST: REDIS_HOST,
    PASSWORD: REDIS_PASSWORD,
    PORT: REDIS_PORT,
  },
};

export default config;
