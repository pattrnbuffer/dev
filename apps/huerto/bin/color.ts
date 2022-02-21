#! /usr/bin/env yarn ts-node

import prompts from 'prompts';
import { all, siphon } from '../common';
import { v3 } from '@dev/node-hue-api';
import { Links, Link, LinkCreated } from './links';
import { Connections } from './connections';
import { LightsType } from './types';
import { inspect } from 'util';
import { Lights, LightLink } from './lights';

export const Color = {
  set: setAllLightsColor,
};

require.main === module && main();
async function main() {
  const states = await setAllLightsColor(
    await Links.read(),
    (state, { light, link }) => {
      console.log(inspect(light.getHuePayload(), false, 4, true));
      return state.bri(50).xy(0.6, 0.35);
    },
  );

  console.log(inspect(states, false, 5, true));
}

export type LightScale = 'white' | 'hsb' | 'hsl' | 'rgb';
export type LightColor<S extends LightScale> = {
  scale: S;
  value: 'white' extends S ? [number, number] : [number, number, number];
};

const WTF = new v3.lightStates.LightState();
export async function setAllLightsColor<S extends LightScale>(
  links: Link[],
  resolve: (state: typeof WTF, link: LightLink) => typeof WTF,
) {
  const allLights = await Lights.all(links);
  const result = await all(allLights, async ({ light, link }) => {
    const state = resolve(new v3.lightStates.LightState(), { light, link });

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
