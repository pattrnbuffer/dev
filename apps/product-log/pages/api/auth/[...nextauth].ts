import type { NextApiHandler } from 'next';
import NextAuth from 'next-auth';

import { options } from 'lib/next-auth';

export default <NextApiHandler>((req, res) =>
  NextAuth(req, res, {
    ...options,

    debug: true,

    callbacks: {
      async redirect(params) {
        return '/';
      },
    },
  }));
