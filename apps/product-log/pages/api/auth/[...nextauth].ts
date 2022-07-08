// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler } from 'next';
import { redisAuthAdapter } from 'lib/redis';
import NextAuth from 'next-auth';
import { GithubAuthProvider } from 'lib/github';

export default <NextApiHandler>((req, res) =>
  NextAuth(req, res, {
    adapter: redisAuthAdapter,
    providers: [GithubAuthProvider],
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.AUTH_SECRET,
    jwt: { secret: process.env.JWT_SECRET },
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
  }));
