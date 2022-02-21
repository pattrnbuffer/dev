#! /usr/bin/env yarn ts-node

import got from 'got';
import { appId, latLong } from './config';

require.main === module && main();
export async function main() {
  const weather = await got(urlFor(appId, latLong)).json();

  console.log(weather);
}

function urlFor(id: string, [lat, long]: [string, string]) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${id}`;
}
