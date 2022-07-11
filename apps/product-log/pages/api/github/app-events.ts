import type { NextApiHandler } from 'next';
import NextAuth from 'next-auth';

import { options } from 'lib/next-auth';

export default <NextApiHandler>function GithubAppEventsHandler(req, res) {
  console.log('req.headers', req.headers);
  console.log('req.query', req.query);
  console.log('req.body', req.body);
  console.log('req.method', req.method);
  console.log('req.url', req.url);

  res.status(200).end();
};
