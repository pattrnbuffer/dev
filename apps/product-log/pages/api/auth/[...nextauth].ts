import type { NextApiHandler } from 'next';
import NextAuth from 'next-auth';

import { redisAuthAdapter } from 'lib/redis';
import { GithubAuthProvider } from 'lib/github';

export default <NextApiHandler>((req, res) =>
  NextAuth(req, res, {
    secret: process.env.NEXTAUTH_SECRET,
    jwt: { secret: process.env.JWT_SECRET },

    providers: [GithubAuthProvider],
    adapter: redisAuthAdapter,
    session: { strategy: 'database' },

    callbacks: {
      // TODO review this
      async redirect(params) {
        console.log(
          'NextApiHandler:NextAuth:callbacks:redirect(:params)',
          params,
        );
        return '/';
      },
    },

    debug: process.env.NODE_ENV === 'development',
  }));
