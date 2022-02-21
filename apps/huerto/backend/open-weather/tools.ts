export function urlFor(id: string, [lat, long]: [string, string]) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${id}`;
}
