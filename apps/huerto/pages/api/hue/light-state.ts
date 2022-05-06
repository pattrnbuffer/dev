import type { NextApiRequest, NextApiResponse } from 'next';
import { inspect } from 'util';
import { pick, pickBy, filter } from 'lodash';
import { v3 } from '@dev/node-hue-api';

import { Lights } from '~/bin/lights';
import { Links } from '~/bin/links';
import { mapPromise } from '~/../../packages/tools/build';

export type LightStateRequest = {
  command: LightStateCommand;
  targets: string[];
}[];

export type LightStateResponse = Awaited<
  ReturnType<typeof resolveLightStateRequest>
>;

export type LightStateCommand = {
  on?: boolean;
  effect?: 'none' | 'colorloop';
  alert?: 'none' | 'select' | 'lselect';
  transition?: number;

  brightness?: number;
  bri: number;
  bri_inc?: number;
  hue: number;
  hue_inc?: number;
  saturation?: number;
  sat: number;
  sat_inc?: number;
  ct: number;
  ct_inc?: number;
} & Partial<
  | {}
  | { hsb: [number, number, number] }
  | { hsl: [number, number, number] }
  | { rgb: [number, number, number] }
  | { white: [number, number] }
  | { xy: [number, number] }
  | { xy_inc: number }
>;

export type LightState = {
  on: boolean;
  bri: number;
  hue: number;
  sat: number;
  ct: number;
  xy: [number, number];
  effect: 'none' | 'colorloop';
  alert: 'none' | 'select' | 'lselect';
  colormode: unknown;
  mode: unknown;
  reachable: boolean;
};

export default async function LightState(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST')
    return res
      .status(200)
      .json(
        await resolveLightStateRequest(
          JSON.parse(req.body) as LightStateRequest,
        ),
      );
  else
    return res.status(405).send({
      message: "This is not the endpoint you're looking for",
    });
}

async function resolveLightStateRequest(requests: LightStateRequest) {
  const allLights = await Links.read().then(Lights.all);

  return mapPromise(mapRequestStates(requests), async ({ request, state }) => {
    const targets = allLights.filter(value =>
      request.targets.includes(value.light.id as string),
    );

    const results = await mapPromise(targets, async ({ light, link }) => {
      const succeeded = await link.api.lights.setLightState(light.id, state);
      console.log(
        succeeded,
        toLightState(light.state),
        toLightState(state),
        // @ts-ignore
        state._state,
      );
      return succeeded
        ? {
            type: 'light-state:updated',
            id: light.id,
            state: {
              ...toLightState(light.state),
              ...toLightState(
                // @ts-expect-error: idiots api remains idiotic
                state._state,
              ),
            },
          }
        : {
            type: 'light-state:error',
            id: light.id,
            state: toLightState(light.state),
          };
    });

    return { request, results };
  });
}

function mapRequestStates(requests: LightStateRequest) {
  return requests.map(request => ({
    request,
    state: (Object.keys(request.command) as (keyof LightStateCommand)[]).reduce(
      (light, key) => {
        const method = light[key];
        const input = request.command[key];
        const params = Array.isArray(input) ? input : [input];
        return apply(method, params, light) ?? light;
      },
      new v3.lightStates.LightState(),
    ),
  }));
}

function apply<R, T extends (...args: any) => R>(
  fn: T,
  params?: unknown,
  scope?: unknown,
  fallback?: R,
) {
  if (typeof fn === 'function') {
    try {
      return fn.apply(scope, Array.isArray(params) ? params : []);
    } catch (e) {}
  }

  return fallback;
}

function toLightState<T extends Record<keyof LightState, any>>(
  value: Partial<T>,
): LightState {
  const keys = [
    'on',
    'bri',
    'hue',
    'sat',
    'ct',
    'xy',
    'effect',
    'alert',
    'colormode',
    'mode',
    'reachable',
  ];

  return <LightState>pickBy(value, (v, k) => {
    return (
      keys.includes(k) &&
      (typeof v === 'boolean' ||
        typeof v === 'number' ||
        typeof v === 'string' ||
        Array.isArray(v))
    );
  });
}
