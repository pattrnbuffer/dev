// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { inspect } from 'util';
import { notion } from '~/backend/notion';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const databases = await notion.db.all();

  console.log('notion databases', inspect(databases, true, 10));

  // for (const db of databases) {
  //   for (const key of Object.keys(db.properties)) {
  //     let value = db.properties[key];
  //     if (value.type === 'relation') {
  //       const db = await notion.db.pages(value.relation.database_id);
  //       console.log(inspect(db, true, 10));
  //     }
  //   }
  // }

  res.status(200).json(databases);
}
