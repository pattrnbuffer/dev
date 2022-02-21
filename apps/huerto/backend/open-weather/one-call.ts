export const OneCall = {
  url: urlForOneCall,
};

export type OneCallProps = {
  appId: string;
  location: [string, string];
};

export function urlForOneCall({ appId, location: [lat, long] }: OneCallProps) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${appId}`;
}
