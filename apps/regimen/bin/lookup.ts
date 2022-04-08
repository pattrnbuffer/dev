#! /usr/bin/env yarn ts-node

import ora from 'ora';
import { inspect } from 'util';
import { notion } from '~/backend/notion';
import { promise } from '@dev/tools';
import prompts from 'prompts';
/**
 * TODO: pull table into file
 */
async function main() {
  const [data] = await promise.follow(resolveOrdinaryDatabase, async ref => {
    ora.promise(ref, {
      text: 'Loading database',
      // successText: 'Loaded database!',
      // failText: 'Something went awfully wrong 😰',
    });
  });

  console.log(inspect(data, false, 10, true));
}

export const resolveOrdinaryDatabase = async () => {
  const result = await notion.db.all();
  const database = result.find((v: any) =>
    v?.title?.some((v: any) => /ordinary\.db/.test(v.plain_text)),
  );

  const pages = database?.id ? await notion.db.pages(database.id) : [];

  return { database, pages };
};

// let's run this hot tamale 🏎💨…
require.main === module && main();
