export const appId = process.env.OPENWEATHER_APP_ID ?? 'MISSING_APP_ID';

const [lat, long] = process.env.LAT_LONG?.replace(/\s/g, '').split(',') ?? [];
export const latLong: [string, string] = [
  lat ?? 'MISSING_LAT_LONG',
  long ?? 'MISSING_LAT_LONG',
];
