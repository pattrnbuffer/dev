#! /usr/bin/env yarn ts-node

import { inspect } from 'util';
import prompts from 'prompts';
import { all } from '../common';
import { v3 } from '@dev/node-hue-api';
import { Links, Link } from './links';
import { Lights, LightLink } from './lights';
import { LightsState, Promisable } from './types';
import { colorPrompt, XYReturnType } from './colors.prompts';

export const Color = {
  set: setColorForAllLights,
};

require.main === module && main();

async function main() {
  const links = await Links.read();

  let states: ColorLink[] = [];

  for (
    let state = { loop: true };
    state.loop;
    state = await prompts({
      name: 'loop',
      type: 'confirm',
      message: 'continue?',
      initial: true,
    })
  ) {
    const { xy } = (await prompts(colorPrompt.xy)) as XYReturnType;

    states = await setColorForAllLights(links, async state => {
      return state.xy(...xy);
    });
  }

  console.log(
    inspect(
      // @ts-expect-error: idiots api doesn't publicly expose the
      //                   light state on a class called light state
      states.map(({ state }) => state._state),
      false,
      6,
      true,
    ),
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
  const result = await all(allLights, async ({ light, link }) => {
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
