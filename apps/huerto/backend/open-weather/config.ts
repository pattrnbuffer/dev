export const appId =
  process.env.OPENWEATHER_APP_ID ?? 'env:missing:OPENWEATHER_APP_ID';

const [lat, long] =
  process.env.OPENWEATHER_LOCATION?.replace(/\s/g, '').split(',') ?? [];

export const location: [string, string] = [
  lat ?? 'env:missing:OPENWEATHER_LOCATION',
  long ?? 'env:missing:OPENWEATHER_LOCATION',
];

export const dataUrl = `https://api.openweathermap.org/data/2.5`;

export const units: 'standard' | 'metirc' | 'imperial' = 'imperial';
