#! /usr/bin/env yarn ts-node

import { location } from './config';
import { oneCall } from './one-call';

require.main === module && main();
async function main() {
  const weather = await oneCall({ location });

  console.log(weather);
  console.table(weather.current);
}
