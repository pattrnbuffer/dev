import { Client } from '@notionhq/client';
import { config } from '~/backend/config';
import { cache } from '~/backend/cache';
import { foxy } from '~/common';

const client = new Client({
  auth: config.notion.token,
});

type Page = Awaited<ReturnType<typeof Client.prototype.pages.retrieve>>;
type Database = Awaited<ReturnType<typeof Client.prototype.databases.retrieve>>;
type DatabaseQuery = Awaited<
  ReturnType<typeof Client.prototype.databases.query>
>;

const all = async () => {
  const { results } = await client.search({
    filter: { property: 'object', value: 'database' },
  });

  return results;
};

const db = {
  all,

  pages: cache.resolveForMany('page', async (id: string) => {
    const queries = await drain(
      async cursor => {
        let value = await client.databases.query({
          database_id: id,
          start_cursor: cursor ?? undefined,
        });
        console.log('requesting pages for', { id, cursor, value });
        return value;
      },
      v => v?.next_cursor,
    );

    return queries.flatMap(q => q.results) as Page[];
  }),
};

async function drain<T>(
  operation: (cursor?: string | undefined) => Promise<T>,
  cursor: (value?: T) => string | null | undefined,
) {
  const results: T[] = [];
  while (results[0] == null || cursor(results[0]) != null) {
    results.unshift(await operation(cursor(results[0]) ?? undefined));
  }
  return results;
}

export const notion = Object.assign(client, { db });
