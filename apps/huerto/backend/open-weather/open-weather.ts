/**
 * Open Weaaaaather
 *
 * Limit:
 *  1,000,000 calls per month | 60 calls per minute
 *  = 23 calls per minute = 23.15 = 1,000,000 / (30 * 24 * 60)
 *  = 6480 spare retries  =  0.15 * (30 * 24 * 60)
 *  = 2.63 second update interval
 *
 * https://openweathermap.org/price
 * https://openweathermap.org/api/one-call-api
 * https://openweathermap.org/darksky-openweather
 */
export const OpenWeather = {
  create() {
    throw 'OpenWeather not implemented';
  },
};
