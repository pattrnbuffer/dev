import { type NextAuthOptions } from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import GitHubProvider from 'next-auth/providers/github';

import { app } from './github';
import { redis } from './upstash';

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: 'database' },
  adapter: UpstashRedisAdapter(redis, {
    baseKeyPrefix: process.env.APP_PREFIX as string,
  }),
  jwt: { secret: process.env.JWT_SECRET },

  providers: [
    GitHubProvider({
      clientId: app.clientId,
      clientSecret: app.clientSecret,
      authorization: `https://github.com/login/oauth/authorize?scope=${app.scope.join(
        '+',
      )}`,
    }),
  ],
};
