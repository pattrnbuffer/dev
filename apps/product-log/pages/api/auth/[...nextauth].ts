import type { NextApiHandler } from 'next';
import NextAuth from 'next-auth';

import { options } from 'lib/next-auth';

export default <NextApiHandler>((req, res) =>
  NextAuth(req, res, {
    ...options,

    debug: true,

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
