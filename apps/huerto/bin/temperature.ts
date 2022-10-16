#! /usr/bin/env yarn ts-node

import { v3 } from '@bffr/node-hue-api';
import { Link } from './links';
import { Lights, LightLink } from './lights';
import { LightsState, Promisable } from './types';
import { mapPromise } from '@bffr/tools';

export const Color = {
  set: setColorForAllLights,
};

export type ColorLink = LightLink & {
  state: LightsState;
};
export type LightScale = 'white' | 'hsb' | 'hsl' | 'rgb';
export type LightColor<S extends LightScale> = {
  scale: S;
  value: 'white' extends S ? [number, number] : [number, number, number];
};

export async function setColorForAllLights(
  links: Link[],
  resolve: (state: LightsState, link: LightLink) => Promisable<LightsState>,
): Promise<ColorLink[]> {
  const allLights = await Lights.all(links);
  const result = await mapPromise(allLights, async ({ light, link }) => {
    const state = await resolve(new v3.lightStates.LightState(), {
      light,
      link,
    });

    try {
      await link.api.lights.setLightState(light.id, state);
    } catch (e) {
      // TODO reset state
    }

    return {
      light,
      link,
      state,
    };
  });

  return result.flat(1);
}
