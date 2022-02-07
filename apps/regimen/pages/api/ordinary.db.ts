// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { inspect } from 'util';
import { notion } from '~/backend/notion';

export default async function ordinarydbHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const database = (await notion.db.all()).find((v: any) =>
    v?.title?.some((v: any) => /ordinary\.db/.test(v.plain_text)),
  );

  const pages = database?.id ? await notion.db.pages(database.id) : [];

  res.status(200).json({ database, pages });
}
