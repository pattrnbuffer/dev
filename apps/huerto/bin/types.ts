import * as idiots from '@dev/node-hue-api';

export type Bridge = Awaited<
  ReturnType<typeof idiots.discovery.nupnpSearch>
>[number];

export type API = Awaited<
  ReturnType<ReturnType<typeof idiots.api.createLocal>['connect']>
>;

export type LightsType = Awaited<ReturnType<API['lights']['getLight']>>;
