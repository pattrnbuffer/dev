// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { inspect } from 'util';
import { notion } from '~/backend/notion';
import { Database } from '~/common';

export default async function ordinary_db(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(200).json(await resolveOrdinaryDatabase());
}

export const resolveOrdinaryDatabase = async () => {
  const result = await notion.db.all();
  const database = result.find((v: any) =>
    v?.title?.some((v: any) => /ordinary\.db/.test(v.plain_text)),
  );

  const pages = database?.id ? await notion.db.pages(database.id) : [];

  return { database, pages };
};
