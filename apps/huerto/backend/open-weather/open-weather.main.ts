#! /usr/bin/env yarn ts-node

import { DateTime } from 'luxon';
import { location } from './config';
import { oneCall } from './one-call';
import { Current, Daily } from './types';

require.main === module && main();
export async function main() {
  const weather = await oneCall({
    location,
  });

  console.table(weather.daily.map(formatForcast));
  console.table(weather.hourly.map(formatForcast));
  console.table([weather.current].map(formatForcast));
}

const formats = {
  hourly: ['sunrise', 'sunset', 'moonrise', 'moonset'],
  daily: ['dt'],
} as const;

/**
 * TODO: the data needs to be patch for wholes with interpolated values
 *        specifically moonset was empty for Tue February 22nd 12:00 PM
 *        — it may actually be that it has an error with midnight
 *          the values are [11:12 PM, 0, 12:25 PM]
 */
type Fields = typeof formats.daily[number] | typeof formats.hourly[number];
function formatForcast<T extends Partial<Record<Fields, number | undefined>>>(
  value: T,
) {
  formats.daily.forEach(field => {
    const time = value[field];
    if (time && time > 0)
      value = { ...value, [field]: formatSeconds('ccc t', time) };
  });

  formats.hourly.forEach(field => {
    const time = value[field];
    if (time && time > 0)
      value = { ...value, [field]: formatSeconds('t', time) };
  });

  return value;
}

function formatSeconds(format: string, value: number) {
  return DateTime.fromSeconds(value).toFormat(format);
}
