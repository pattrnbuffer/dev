import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

console.log(
  'process.env.UPSTASH_REDIS_REST_URL',
  process.env.UPSTASH_REDIS_REST_URL,
);
console.log(
  'process.env.UPSTASH_REDIS_REST_TOKEN',
  process.env.UPSTASH_REDIS_REST_TOKEN,
);
