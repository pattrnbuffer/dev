import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import type { NextAuthOptions } from 'next-auth';
import { GithubAuthProvider } from './github';
import { redis } from './upstash';

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  jwt: { secret: process.env.JWT_SECRET },

  providers: [GithubAuthProvider],

  adapter: UpstashRedisAdapter(redis, {
    baseKeyPrefix: process.env.APP_PREFIX as string,
  }),
  session: { strategy: 'database' },
};
