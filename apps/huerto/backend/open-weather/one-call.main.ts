#! /usr/bin/env yarn ts-node

import * as config from './config';
import { OneCall } from './one-call';

require.main === module && main();
async function main() {
  console.log(OneCall.url(config));
}
