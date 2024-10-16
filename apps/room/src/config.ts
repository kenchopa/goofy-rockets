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
};

type MongoDB = {
  HOST: string;
  PORT: number;
  USER: string;
  PASSWORD: string;
  DB: string;
};

type Config = {
  APP: App;
  RABBITMQ: RabbitMQ;
  MONGODB: MongoDB;
};

const configSchema = Joi.object({
  DOCS_URI: Joi.string().required(),
  LOG_LEVEL: Joi.string().required(),
  MONGODB_DB: Joi.string().default('campaigns'),
  MONGODB_HOST: Joi.string().default('localhost'),
  MONGODB_OPTIONS: Joi.string().empty('').optional(),
  MONGODB_PASSWORD: Joi.string().empty('').optional(),
  MONGODB_PROTOCOL: Joi.string().default('mongodb'),
  MONGODB_USER: Joi.string().empty('').optional(),
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(3000),
  RABBITMQ_EXCHANGE: Joi.string().required(),
  RABBITMQ_HEARTBEAT: Joi.number().required(),
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_USER: Joi.string().required(),
  RABBITMQ_VHOST: Joi.string().required(),
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
    MONGODB_DB,
    MONGODB_HOST,
    MONGODB_PASSWORD,
    MONGODB_PORT,
    MONGODB_USER,
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
  MONGODB: {
    DB: MONGODB_DB,
    HOST: MONGODB_HOST,
    PASSWORD: MONGODB_PASSWORD,
    PORT: MONGODB_PORT,
    USER: MONGODB_USER,
  },
  RABBITMQ: {
    EXCHANGE: RABBITMQ_EXCHANGE,
    HEARTBEAT: RABBITMQ_HEARTBEAT,
    HOST: RABBITMQ_HOST,
    PASSWORD: RABBITMQ_PASSWORD,
    PORT: RABBITMQ_PORT,
    USER: RABBITMQ_USER,
    VHOST: RABBITMQ_VHOST,
  },
};

export default config;
