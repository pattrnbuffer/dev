import * as idiots from '@dev/node-hue-api';

export type Promisable<T> = T | Promise<T>;

export type Bridge = Awaited<
  ReturnType<typeof idiots.discovery.nupnpSearch>
>[number];

export type API = Awaited<
  ReturnType<ReturnType<typeof idiots.api.createLocal>['connect']>
>;

export type LightsType = Awaited<ReturnType<API['lights']['getLight']>>;

// TODO: how to reflect type of new class instance
const LS = new idiots.v3.lightStates.LightState();
export type LightsState = typeof LS;
