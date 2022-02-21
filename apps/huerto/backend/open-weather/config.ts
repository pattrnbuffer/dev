export const appId =
  process.env.OPENWEATHER_APP_ID ?? 'env:missing:OPENWEATHER_APP_ID';

const [lat, long] =
  process.env.OPENWEATHER_LOCATION?.replace(/\s/g, '').split(',') ?? [];

export const location: [string, string] = [
  lat ?? 'env:missing:OPENWEATHER_LOCATION',
  long ?? 'env:missing:OPENWEATHER_LOCATION',
];
