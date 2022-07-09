import Redis from 'ioredis';
import { Redis as UpstashRedis } from '@upstash/redis';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';

export const redis = new Redis(process.env.REDIS_URL as string, {
  keyPrefix: process.env.APP_PREFIX as string,
});

export const redisUpstashClient = new UpstashRedis({
  url: process.env.REDIS_HTTP_URL as string,
  token: process.env.REDIS_HTTP_TOKEN as string,
});

export const redisAuthAdapter = UpstashRedisAdapter(redisUpstashClient, {
  baseKeyPrefix: process.env.APP_PREFIX as string,
});
