#! /usr/bin/env yarn ts-node

import { argv } from 'zx';
import { location } from './config';
import { oneCall } from './one-call';

require.main === module && main();
async function main() {
  const [type] = argv._ as ['url' | 'weather'];

  switch (type) {
    case 'url':
      const url = oneCall.url({ location });

      console.log(url);

      return;

    case 'weather':
    default:
      const weather = await oneCall({ location });

      console.log(weather);
      console.table(weather.current);

      return;
  }
}
