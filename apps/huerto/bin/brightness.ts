#! /usr/bin/env yarn ts-node

import { v3 } from '@dev/node-hue-api';
import { Links, Link } from './links';
import { Lights, LightLink } from './lights';
import { LightsState, Promisable } from './types';
import { promptFor } from '@dev/prompts';
import { mapPromise } from '@dev/tools';

export const Color = {
  set: setColorForAllLights,
};

require.main === module && main();

async function main() {
  const links = await Links.read();

  let states: ColorLink[] = [];

  while (
    await promptFor<undefined | number>(
      { type: 'text', name: 'brightness', message: '💡' },
      {
        async onSubmit(_, answer: string) {
          const value = Number(answer);

          if (answer == null || !answer.length || Number.isNaN(value)) {
            return true;
          }

          states = await setColorForAllLights(links, async state => {
            return state.bri(value);
          });
        },
      },
    )
  );
}

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
