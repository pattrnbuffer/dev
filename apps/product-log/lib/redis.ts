import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL as string, {
  keyPrefix: process.env.APP_PREFIX as string,
});
