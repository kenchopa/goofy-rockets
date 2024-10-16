import logger from '@wgp/logger';
import { createClient, RedisClientType } from 'redis';

import config from '../config';

const redisClient: RedisClientType = createClient({
  database: config.REDIS.DB,
  password: config.REDIS.PASSWORD,
  url: `redis://${config.REDIS.HOST}:${config.REDIS.PORT}`,
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    throw new Error(`Failed to connect to Redis: ${error}`);
  }
};

export default redisClient;
