// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler } from 'next';
import { redis } from 'lib/redis';

const handler: NextApiHandler = async (req, res) => {
  const what = redis.hget('what', 'what');
  const payload = await redis.hget('feedback', '1');
  // res.status(200).json({ name: 'John Doe' })
};

export { handler as default };
